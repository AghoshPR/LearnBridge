from rest_framework import serializers
from authapp.models import User
from .models import Wishlist
class StudentProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = User
        fields=[
            "username",
            "email",
            "phone",
            "address",
            "profile_image"
        ]

        read_only_fields = ["username","email"]


class WishlistSerializer(serializers.ModelSerializer):

    title = serializers.CharField(source="course.title",read_only=True)
    price = serializers.DecimalField(source="course.price", max_digits=10, decimal_places=2, read_only=True)
    thumbnail = serializers.SerializerMethodField()
    instructor = serializers.CharField(source="course.teacher.username", read_only=True)

    class Meta:

        model = Wishlist
        fields = ["id","course","title","price","thumbnail","instructor"]

    
    def get_thumbnail(self,obj):

        return obj.course.thumbnail.url if obj.course.thumbnail else None


