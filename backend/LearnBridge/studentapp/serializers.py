from rest_framework import serializers
from authapp.models import User
from .models import Wishlist
from studentapp.models import *


class StudentProfileSerializer(serializers.ModelSerializer):

    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "phone",
            "address",
            "profile_image"
        ]
        read_only_fields = ["username", "email"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.profile_image and hasattr(instance.profile_image, 'url'):
            representation['profile_image'] = instance.profile_image.url
        return representation

    def validate_phone(self, value):
        if not value:
            return value

        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits.")

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must be exactly 10 digits.")

        return value


class WishlistSerializer(serializers.ModelSerializer):

    title = serializers.CharField(source="course.title", read_only=True)
    price = serializers.DecimalField(
        source="course.price", max_digits=10, decimal_places=2, read_only=True)
    thumbnail = serializers.SerializerMethodField()
    instructor = serializers.CharField(
        source="course.teacher.username", read_only=True)

    class Meta:

        model = Wishlist
        fields = ["id", "course", "title", "price", "thumbnail", "instructor"]

    def get_thumbnail(self, obj):

        return obj.course.thumbnail.url if obj.course.thumbnail else None


class MyCourseSerializer(serializers.ModelSerializer):

    course_id = serializers.IntegerField(source="course.id")
    title = serializers.CharField(source="course.title")
    thumbnail = serializers.SerializerMethodField()
    instructor = serializers.CharField(source="course.teacher.username")
    price = serializers.DecimalField(
        source="course.price", max_digits=10, decimal_places=2)
    purchaseDate = serializers.DateTimeField(source="enrolled_at")

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course_id",
            "title",
            "thumbnail",
            "instructor",
            "price",
            "purchaseDate",
            "progress",
            "status",
            "enrolled_at"
        ]

    def get_thumbnail(self, obj):

        return obj.course.thumbnail.url if obj.course.thumbnail else None


class StudentLessonSerializer(serializers.ModelSerializer):

    thumbnail = serializers.SerializerMethodField()

    class Meta:

        model = Lesson
        fields = ["id", "title", "description",
                  "duration", "position", "thumbnail"]

    def get_thumbnail(self, obj):

        return obj.course.thumbnail.url if obj.course.thumbnail else None
