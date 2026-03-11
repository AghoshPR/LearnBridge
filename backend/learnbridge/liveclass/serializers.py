from rest_framework import serializers
from django.utils import timezone
from .models import *


class LiveClassSerializer(serializers.ModelSerializer):

    registered_count = serializers.SerializerMethodField()
    course_name = serializers.CharField(source="course.title", read_only=True)
    teacher_name = serializers.CharField(
        source="teacher.user.username", read_only=True)
    thumbnail = serializers.ImageField(required=False)
    is_registered = serializers.SerializerMethodField()

    class Meta:

        model = LiveClass
        fields = "__all__"
        read_only_fields = ("teacher", "created_at")

    def get_registered_count(self, obj):
        return obj.registrations.count()

    def validate(self, data):
        start = data.get("start_time")
        end = data.get("end_time")
        fee = data.get("registration_fee", 0)

        if not start or not end:
            raise serializers.ValidationError(
                "Start and end time are required.")

        if start and end:
            if start >= end:
                raise serializers.ValidationError(
                    "End time must be after start time.")

        if not self.instance and start < timezone.now():
            raise serializers.ValidationError(
                "Cannot schedule class in the past.")

        if fee < 0:
            raise serializers.ValidationError(
                "Registration fee cannot be negative.")

        return data

    def validate_thumbnail(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError(
                "Thumbnail must be less than 2MB.")

        if not value.content_type.startswith("image"):
            raise serializers.ValidationError("Only image files are allowed.")

        return value

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value

    def get_is_registered(self, obj):

        user = self.context["request"].user

        if user.is_authenticated:
            return LiveClassRegistration.objects.filter(
                live_class=obj,
                user=user
            ).exists()
        return False
