from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authapp.permissions import IsAdmin
from .models import *
from django.utils import timezone
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from payments.serializers import *


class AdminOfferListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        offers = Offer.objects.filter(is_deleted=False).order_by("-created_at")
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)


class AdminOfferCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):

        serializer = OfferSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class AdminOfferUpdateView(APIView):

    permission_classes = [IsAdmin]

    def put(self, request, pk):

        try:
            offer = Offer.objects.get(pk=pk, is_deleted=False)

        except Offer.DoesNotExist:
            return Response({"error": "Offer not found"}, status=404)

        serializers = OfferSerializer(offer, data=request.data, partial=True)

        if serializers.is_valid():

            serializers.save()
            return Response(serializers.data)

        return Response(serializers.errors, status=400)


class AdminOfferDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, pk):

        try:

            offer = Offer.objects.get(pk=pk)

        except Offer.DoesNotExist:

            return Response({"error": "Offer not found"})

        offer.is_deleted = True
        offer.is_active = False
        offer.save()

        return Response({"message": "offer deleted successfully"})

# Admin Coupons


class AdminCouponListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        coupons = Coupon.objects.filter(
            is_deleted=False).order_by("-created_at")
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)


class AdminCouponCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):

        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class AdminCouponUpdateView(APIView):

    permission_classes = [IsAdmin]

    def put(self, request, pk):

        coupon = Coupon.objects.get(pk=pk)
        serializer = CouponSerializer(coupon, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class AdminCouponsDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, pk):

        try:

            coupon = Coupon.objects.get(pk=pk)
        except Coupon.DoesNotExist:

            return Response({"error": "Coupon not found"}, status=404)

        coupon.is_active = False
        coupon.is_deleted = True
        coupon.save()
        return Response({"message": "Coupon deactivated"})


# student coupon List view

class StudentCouponListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        today = timezone.now().date()

        coupons = Coupon.objects.filter(
            is_active=True,
            is_deleted=False,


        )

        serializer = CouponSerializer(
            coupons,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class ApplyCouponView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        code = request.data.get("code")
        user = request.user

        if not code:
            return Response({"error": "Coupon code required"}, status=400)
        try:

            coupon = Coupon.objects.get(code__iexact=code, is_active=True)

        except Coupon.DoesNotExist:
            return Response({"error": "Invalid coupon"}, status=400)

        today = timezone.now().date()

        # if not (coupon.valid_from <= today <= coupon.valid_till):
        #     return Response({"error":"Coupon expired"},status=400)

        if coupon.max_uses and coupon.used_count >= coupon.max_uses:
            return Response({"error": "Coupon usage limit reacher"}, status=400)

        # cart

        cart = request.user.cart

        cart_serializer = CartSerializer(cart)
        cart_total = Decimal(cart_serializer.data["total_amount"])

        if cart_total < coupon.min_purchase_amount:

            return Response({
                "error": f"Minimum purchase amount ₹{coupon.min_purchase_amount} required"

            }, status=400)

        # Calculate discount

        if coupon.discount_type == "percentage":

            discount = cart_total * Decimal(coupon.discount_value)/100
        else:

            discount = Decimal(coupon.discount_value)

        discount = min(discount, cart_total)

        final_total = cart_total - discount

        return Response({
            "original_total": cart_total,
            "discount": discount,
            "final_total": final_total,
            "coupon_id": coupon.id
        })
