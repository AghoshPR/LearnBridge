from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authapp.permissions import IsAdmin
from .models import *
from django.utils import timezone
from django.db.models import Q, F
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from payments.serializers import *


class AdminOfferListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            offers = Offer.objects.filter(is_deleted=False).order_by("-created_at")
            serializer = OfferSerializer(offers, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminOfferCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):
        try:
            serializer = OfferSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminOfferUpdateView(APIView):

    permission_classes = [IsAdmin]

    def put(self, request, pk):
        try:
            try:
                offer = Offer.objects.get(pk=pk, is_deleted=False)
            except Offer.DoesNotExist:
                return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

            serializers = OfferSerializer(offer, data=request.data, partial=True)
            if serializers.is_valid():
                serializers.save()
                return Response(serializers.data)

            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminOfferDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            try:
                offer = Offer.objects.get(pk=pk)
            except Offer.DoesNotExist:
                return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

            offer.is_deleted = True
            offer.is_active = False
            offer.save()

            return Response({"message": "offer deleted successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin Coupons


class AdminCouponListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            coupons = Coupon.objects.filter(
                is_deleted=False).order_by("-created_at")
            serializer = CouponSerializer(coupons, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminCouponCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):
        try:
            serializer = CouponSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminCouponUpdateView(APIView):

    permission_classes = [IsAdmin]

    def put(self, request, pk):
        try:
            try:
                coupon = Coupon.objects.get(pk=pk)
            except Coupon.DoesNotExist:
                return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = CouponSerializer(coupon, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminCouponsDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            try:
                coupon = Coupon.objects.get(pk=pk)
            except Coupon.DoesNotExist:
                return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)

            coupon.is_active = False
            coupon.is_deleted = True
            coupon.save()
            return Response({"message": "Coupon deactivated"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# student coupon List view

class StudentCouponListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            today = timezone.now().date()

            active_coupons = Coupon.objects.filter(
                Q(max_uses=0) | Q(used_count__lt=F('max_uses')),
                is_active=True,
                is_deleted=False,
            )

            valid_coupons = []
            for c in active_coupons:
                if c.max_uses_per_user == 0:
                    valid_coupons.append(c)
                else:
                    user_uses = CouponUsage.objects.filter(coupon=c, user=request.user).count()
                    if user_uses < c.max_uses_per_user:
                        valid_coupons.append(c)

            serializer = StudentCouponSerializer(
                valid_coupons,
                many=True,
                context={"request": request}
            )

            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApplyCouponView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            code = request.data.get("code")
            user = request.user

            if not code:
                return Response({"error": "Coupon code required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                coupon = Coupon.objects.get(code__iexact=code, is_active=True)
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid coupon"}, status=status.HTTP_400_BAD_REQUEST)

            today = timezone.now().date()

            if coupon.max_uses and coupon.used_count >= coupon.max_uses:
                return Response({"error": "Coupon usage limit reached"}, status=status.HTTP_400_BAD_REQUEST)
                
            if coupon.max_uses_per_user:
                user_uses = CouponUsage.objects.filter(coupon=coupon, user=user).count()
                if user_uses >= coupon.max_uses_per_user:
                    return Response({"error": "You have reached your usage limit for this coupon"}, status=status.HTTP_400_BAD_REQUEST)

            # cart
            cart = getattr(request.user, 'cart', None)
            if not cart:
                 return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

            cart_serializer = CartSerializer(cart)
            cart_total = Decimal(str(cart_serializer.data.get("total_amount", "0")))

            if cart_total < coupon.min_purchase_amount:
                return Response({
                    "error": f"Minimum purchase amount ₹{coupon.min_purchase_amount} required"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Calculate discount
            if coupon.discount_type == "percentage":
                discount = cart_total * Decimal(str(coupon.discount_value)) / 100
            else:
                discount = Decimal(str(coupon.discount_value))

            discount = min(discount, cart_total)
            final_total = cart_total - discount

            return Response({
                "original_total": cart_total,
                "discount": discount,
                "final_total": final_total,
                "coupon_id": coupon.id
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
