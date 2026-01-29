from rest_framework import serializers
from .models import *
from courses.models import *


class CartItemSerializer(serializers.ModelSerializer):

    course_id = serializers.IntegerField(source="course.id",read_only=True)
    title = serializers.CharField(source="course.title",read_only=True)
    price = serializers.DecimalField(
        source="course.price", max_digits=10, decimal_places=2, read_only=True
    )
    thumbnail = serializers.SerializerMethodField()
    instructor = serializers.CharField(source="course.teacher.username",read_only=True)

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
            
        ]

    def get_thumbnail(self, obj):
        return obj.course.thumbnail.url if obj.course.thumbnail else None

class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(many=True,read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:

        model = Cart
        fields =[
            "id",
            "items",
            "total_amount"
        ]

    def get_total_amount(self,obj):
        return sum(item.course.price for item in obj.items.all())
    

class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:

        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True,read_only=True)

    class Meta:

        model = Order
        fields = "__all__"