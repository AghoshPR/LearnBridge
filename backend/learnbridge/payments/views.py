from decimal import Decimal
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from .serializers import *
from courses.models import *
from studentapp.models import *
from .utils import stripe, razorpay_client
from wallet.services import credit_admin_wallet
import hmac
import hashlib
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from notifications.models import *
from promotions.models import Coupon, CouponUsage

channel_layer = get_channel_layer()


class CartDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddtoCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            course_id = request.data.get("course_id")

            if not course_id:
                return Response(
                    {"detail": "course_id is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response(
                    {"detail": "Course not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            cart, _ = Cart.objects.get_or_create(user=request.user)

            if CartItem.objects.filter(cart=cart, course=course).exists():
                return Response(
                    {"detail": "Course already in cart"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            CartItem.objects.create(cart=cart, course=course)
            return Response({"detail": "Added to cart"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveFromCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id):
        try:
            cart = Cart.objects.filter(user=request.user).first()

            if not cart:
                return Response(status=status.HTTP_204_NO_CONTENT)

            CartItem.objects.filter(cart=cart, course_id=course_id).delete()
            return Response({"detail": "Removed from cart"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClearCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            cart = Cart.objects.filter(user=request.user).first()

            if cart:
                cart.items.all().delete()

            return Response({"detail": "Cart cleared"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# order page

class CreateOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            coupon_id = request.data.get("coupon_id")

            cart_items = CartItem.objects.filter(cart__user=user)

            if not cart_items.exists():
                return Response({"error": "Cart is empty"}, status=400)

            total = Decimal("0")
            for item in cart_items:
                total += item.course.price

            discount_amount = Decimal("0")
            coupon = None

            if coupon_id:
                try:
                    coupon = Coupon.objects.get(id=coupon_id, is_active=True)
                    if coupon.discount_type == "percentage":
                        discount_amount = total * \
                            Decimal(str(coupon.discount_value)) / 100
                    else:
                        discount_amount = Decimal(str(coupon.discount_value))
                    discount_amount = min(discount_amount, total)
                except Coupon.DoesNotExist:
                    pass

            final_amount = total - discount_amount

            # create order
            order = Order.objects.create(
                user=user,
                coupon=coupon,
                total_amount=total,
                discount_amount=discount_amount,
                final_amount=final_amount,
                payment_status="pending",
                payment_method="stripe"
            )

            # create order item
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                    discount=0
                )

            try:
                intent = stripe.PaymentIntent.create(
                    amount=int(final_amount * 100),
                    currency="INR",
                    metadata={
                        "order_id": order.id,
                        "user_id": user.id
                    }
                )
                return Response({
                    "order_id": order.id,
                    "client_secret": intent.client_secret
                })
            except Exception as stripe_err:
                return Response({"error": f"Stripe error: {str(stripe_err)}"}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# Stripe


class StripePaymentSuccessView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            payment_intent_id = request.data.get("payment_intent_id")

            # stripe verifying
            try:
                intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            except Exception as stripe_err:
                return Response({"error": f"Stripe retrieval failed: {str(stripe_err)}"}, status=400)

            if intent.status != "succeeded":
                return Response({"error": "Payment not successful"}, status=400)

            order_id = intent.metadata.get("order_id")
            user_id = intent.metadata.get("user_id")

            try:
                order = Order.objects.get(id=order_id, user=request.user)
                user = User.objects.get(id=user_id)
            except (Order.DoesNotExist, User.DoesNotExist):
                return Response({"error": "Order or User not found"}, status=status.HTTP_404_NOT_FOUND)

            if order.payment_status == "paid":
                return Response({"detail": "Already processed"})

            order.payment_status = "paid"
            order.save()

            if order.coupon:
                order.coupon.used_count += 1
                order.coupon.save()
                CouponUsage.objects.create(
                    coupon=order.coupon,
                    user=order.user,
                    order=order
                )

            # enrollment process
            order_items = OrderItem.objects.filter(order=order)
            for item in order_items:
                Enrollment.objects.get_or_create(
                    user=user,
                    course=item.course
                )

            # payment record creating
            Payment.objects.create(
                order=order,
                provider="stripe",
                provider_payment_id=intent.id,
                amount=order.final_amount,
                currency="INR",
                status="completed"
            )

            # wallet credit
            try:
                first_item = order.items.first()
                credit_admin_wallet(
                    amount=order.final_amount,
                    course=first_item.course,
                    description=f"Course purchase – Order #{order.id}"
                )
            except Exception as w_err:
                print(f"Wallet credit failed: {w_err}")

            # Clear cart
            cart = Cart.objects.filter(user=user).first()
            if cart:
                cart.items.all().delete()

            # Notifications
            try:
                notification = Notification.objects.create(
                    user=order.user,
                    title="Payment Successful",
                    message=f"Your payment of ₹{order.final_amount} was successful."
                )
                async_to_sync(channel_layer.group_send)(
                    f"user_{order.user.id}",
                    {
                        "type": "send_notification",
                        "notification": {
                            "id": notification.id,
                            "title": notification.title,
                            "message": notification.message,
                            "is_read": notification.is_read,
                            "created_at": str(notification.created_at),
                        }
                    }
                )
            except Exception as n_err:
                print(f"Notification failed: {n_err}")

            return Response({"detail": "Payment processed & enrolled"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# Razorpay

class CreateRazorpayOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            cart_items = CartItem.objects.filter(cart__user=user)
            coupon_code = request.data.get("coupon_id")

            if not cart_items.exists():
                return Response({"error": "Cart empty"}, status=400)

            try:
                cart = Cart.objects.get(user=user)
            except Cart.DoesNotExist:
                return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

            cart_serilizer = CartSerializer(cart)
            total = Decimal(cart_serilizer.data["total_amount"])

            discount_amount = Decimal("0.00")
            coupon = None

            if coupon_code:
                try:
                    coupon = Coupon.objects.get(
                        code__iexact=coupon_code, is_active=True)
                    if coupon.discount_type == "percentage":
                        discount_amount = total * \
                            Decimal(str(coupon.discount_value)) / 100
                    else:
                        discount_amount = Decimal(str(coupon.discount_value))
                    discount_amount = min(discount_amount, total)
                except Coupon.DoesNotExist:
                    pass

            final_amount = total - discount_amount

            # create oder
            order = Order.objects.create(
                user=user,
                coupon=coupon,
                total_amount=total,
                discount_amount=discount_amount,
                final_amount=final_amount,
                payment_status="pending",
                payment_method="razorpay"
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    course=item.course,
                    price=item.course.price,
                    discount=0
                )

            try:
                razorpay_order = razorpay_client.order.create({
                    "amount": int(final_amount * 100),
                    "currency": "INR",
                    "receipt": f"order_{order.id}",
                    "payment_capture": 1
                })

                return Response({
                    "order_id": order.id,
                    "razorpay_order_id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": "INR",
                    "key": settings.RAZORPAY_KEY_ID
                })
            except Exception as r_err:
                return Response({"error": f"Razorpay error: {str(r_err)}"}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class RazorpayPaymentVerifyView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            razorpay_order_id = data.get("razorpay_order_id")
            razorpay_payment_id = data.get("razorpay_payment_id")
            razorpay_signature = data.get("razorpay_signature")

            # verify signature
            body = f"{razorpay_order_id}|{razorpay_payment_id}"
            try:
                expected_signature = hmac.new(
                    settings.RAZORPAY_KEY_SECRET.encode(),
                    body.encode(),
                    hashlib.sha256
                ).hexdigest()

                if expected_signature != razorpay_signature:
                    return Response({"error": "Invalid payment signature"}, status=400)
            except Exception as sig_err:
                return Response({"error": f"Signature verification error: {str(sig_err)}"}, status=400)

            try:
                order = Order.objects.get(
                    id=data.get("order_id"), user=request.user)
            except Order.DoesNotExist:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

            if order.payment_status == "paid":
                return Response({"detail": "Already processed"})

            order.payment_status = "paid"
            order.save()

            if order.coupon:
                order.coupon.used_count += 1
                order.coupon.save()
                CouponUsage.objects.create(
                    coupon=order.coupon,
                    user=order.user,
                    order=order
                )

            # enrollment process
            for item in order.items.all():
                Enrollment.objects.get_or_create(
                    user=order.user,
                    course=item.course
                )

            Payment.objects.create(
                order=order,
                provider="razorpay",
                provider_payment_id=razorpay_payment_id,
                amount=order.final_amount,
                currency="INR",
                status="completed"
            )

            # wallet credit
            try:
                first_item = order.items.first()
                credit_admin_wallet(
                    amount=order.final_amount,
                    course=first_item.course,
                    description=f"Course purchase - Order #{order.id}",
                    razorpay_payment_id=razorpay_payment_id
                )
            except Exception as w_err:
                print(f"Wallet credit failed: {w_err}")

            # Clear Cart
            CartItem.objects.filter(cart__user=request.user).delete()

            # Notifications
            try:
                notification = Notification.objects.create(
                    user=order.user,
                    title="Payment Successful",
                    message=f"Your payment of ₹{order.final_amount} was successful."
                )
                async_to_sync(channel_layer.group_send)(
                    f"user_{order.user.id}",
                    {
                        "type": "send_notification",
                        "notification": {
                            "id": notification.id,
                            "title": notification.title,
                            "message": notification.message,
                            "is_read": notification.is_read,
                            "created_at": str(notification.created_at),
                        }
                    }
                )
            except Exception as n_err:
                print(f"Notification failed: {n_err}")

            return Response({"detail": "Payment successful & enrolled"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
