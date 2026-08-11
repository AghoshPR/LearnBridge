from rest_framework import serializers
from .models import *
from promotions.models import *
from courses.models import *
from studentapp.models import Enrollment
from django.utils import timezone
from django.db.models import *
from decimal import Decimal


class CartItemSerializer(serializers.ModelSerializer):

    course_id = serializers.IntegerField(source="course.id", read_only=True)
    title = serializers.CharField(source="course.title", read_only=True)
    price = serializers.DecimalField(
        source="course.price", max_digits=10, decimal_places=2, read_only=True
    )
    thumbnail = serializers.SerializerMethodField()
    instructor = serializers.CharField(
        source="course.teacher.username", read_only=True)

    final_price = serializers.SerializerMethodField()
    has_offer = serializers.SerializerMethodField()
    original_price = serializers.DecimalField(
        source="course.price",
        max_digits=10, decimal_places=2, read_only=True
    )
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "course_id",
            "title",
            "price",
            "thumbnail",
            'instructor',
            "added_at",
            "original_price",
            "final_price",
            "has_offer",
            "is_enrolled",

        ]

    def get_thumbnail(self, obj):
        return obj.course.thumbnail.url if obj.course.thumbnail else None

    def get_final_price(self, obj):

        course = obj.course
        now = timezone.now().date()

        offer = Offer.objects.filter(
            is_active=True,
            is_deleted=False,
            start_date__lte=now,
            end_date__gte=now
        ).filter(
            Q(course=course) | Q(category=course.category)
        ).first()

        if not offer:
            return course.price

        if offer.discount_type == "percentage":
            discount = (course.price*Decimal(offer.discount_value)/100)
            return course.price - discount

        elif offer.discount_type == "fixed":
            return max(course.price - Decimal(offer.discount_value), 0)

        return course.price

    def get_has_offer(self, obj):

        course = obj.course
        now = timezone.now().date()

        return Offer.objects.filter(
            is_active=True,
            is_deleted=False,
            start_date__lte=now,
            end_date__gte=now
        ).filter(
            Q(course=course) | Q(category=course.category)
        ).exists()

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Enrollment.objects.filter(user=request.user, course=obj.course).exists()


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:

        model = Cart
        fields = [
            "id",
            "items",
            "total_amount"
        ]

    def get_total_amount(self, obj):

        total = Decimal("0.00")
        serializer = CartItemSerializer(obj.items.all(), many=True)

        for item in serializer.data:
            total += Decimal(item["final_price"])

        return total


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:

        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:

        model = Order
        fields = "__all__"
