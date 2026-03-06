from rest_framework import serializers
from .models import *


class OfferSerializer(serializers.ModelSerializer):

    class Meta:
        model = Offer
        fields = "__all__"
        read_only_fields = ["is_deleted"]

    def validate(self, data):

        apply_type = data.get("apply_type")
        course = data.get("course")
        category = data.get("category")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if apply_type == "Course" and not course:

            raise serializers.ValidationError("Course is required.")

        if apply_type == "Category" and not category:

            raise serializers.ValidationError("Category is required.")

        if start_date and end_date and start_date > end_date:

            raise serializers.ValidationError(
                "End date must be after start date.")

        return data


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = "__all__"

    def validate(self, data):

        valid_from = data.get("valid_from")
        valid_till = data.get("valid_till")
        discount_type = data.get("discount_type")
        discount_value = data.get("discount_value")

        if valid_from > valid_till:
            raise serializers.ValidationError(
                "Valid till must be after valid from.")

        if discount_type == "percentage" and discount_value > 100:
            raise serializers.ValidationError("Percentage cannot exceed 100.")

        return data


class StudentCouponSerializer(serializers.ModelSerializer):

    user_usage_count = serializers.SerializerMethodField()

    class Meta:

        model = Coupon
        fields = [
            "id",
            "code",
            "discount_type",
            "discount_value",
            "valid_from",
            "valid_till",
            "max_uses_per_user",
            "user_usage_count"
        ]

    def get_user_usage_count(self, obj):

        request = self.context.get("request")

        return CouponUsage.objects.filter(
            coupon=obj,
            user=request.user
        ).count()
