from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart,CartItem
from .serializers import *
from courses.models import *
from .utils import stripe


class CartDetailView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self,request):


        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    

class AddtoCartView(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request):

        course_id = request.data.get("course_id")

        if not course_id:
            return Response(
                {"detail":"course_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:

            course = Course.objects.get(id=course_id)

        except Course.DoesNotExist:

            return Response(
                {"detail":"Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart,_=Cart.objects.get_or_create(user=request.user)

        if CartItem.objects.filter(cart=cart,course=course).exists():
            return Response(
                {"detail":"Course already in cart"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        CartItem.objects.create(cart=cart,course=course)
        return Response({"detail":"Added to cart"},status=status.HTTP_201_CREATED)
    

class RemoveFromCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self,request,course_id):

        cart = Cart.objects.filter(user=request.user).first()


        if not cart:
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        CartItem.objects.filter(cart=cart,course_id=course_id).delete()
        return Response({"detail":"Removed from cart"})


class ClearCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self,request):

        cart = Cart.objects.filter(user=request.user).first()

        if cart:

            cart.items.all().delete()

        return Response({"detail":"Cart cleared"})


# order page

class CreateOrderView(APIView):


    permission_classes=[IsAuthenticated]

    def post(self,request):

        user = request.user

        cart_items = CartItem.objects.filter(cart__user=user)

        if not cart_items.exists():
            return Response({"error":"Cart is empty"},status=400)
        

        total=0

        for item in cart_items:
            total+= item.course.price


        # create order 

        order = Order.objects.create(
            user=user,
            total_amount=total,
            discount_amount = 0,
            final_amount = total,
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

        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency="INR",
            metadata={
                "order_id":order.id,
                "user_id":user.id
            }
        )

        return Response({
            "order_id":order.id,
            "client_secret":intent.client_secret
        })
        
