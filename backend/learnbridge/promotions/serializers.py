from rest_framework import serializers
from .models import *


class OfferSerializer(serializers.ModelSerializer):

    class Meta:
        model = Offer
        fields = "__all__"
        read_only_fields = ["used_count", "is_deleted"]

    def validate(self, data):
        apply_type = data.get("apply_type")
        course = data.get("course")
        category = data.get("category")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if self.instance:
            if apply_type is None: apply_type = self.instance.apply_type
            if course is None: course = self.instance.course
            if category is None: category = self.instance.category
            if start_date is None: start_date = self.instance.start_date
            if end_date is None: end_date = self.instance.end_date

        if apply_type == "Course" and not course:
            raise serializers.ValidationError({"course": "Course is required."})

        if apply_type == "Category" and not category:
            raise serializers.ValidationError({"category": "Category is required."})

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({"end_date": "End date must be after start date."})

        discount_type = data.get("discount_type")
        discount_value = data.get("discount_value")

        if discount_value is not None:
            if discount_value <= 0:
                raise serializers.ValidationError(
                    {"discount_value": "Discount value must be greater than zero."})

            if discount_type == "percentage" and discount_value > 100:
                raise serializers.ValidationError(
                    {"discount_value": "Percentage cannot exceed 100%."})

        return data


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = "__all__"
        read_only_fields = ["used_count", "is_deleted"]

    def validate(self, data):
        valid_from = data.get("valid_from")
        valid_till = data.get("valid_till")

        # Check existing dates if doing a partial update
        if self.instance:
            if not valid_from:
                valid_from = self.instance.valid_from
            if not valid_till:
                valid_till = self.instance.valid_till

        if valid_from and valid_till and valid_from > valid_till:
            raise serializers.ValidationError(
                {"valid_till": "Valid till must be after valid from."})

        discount_type = data.get("discount_type")
        discount_value = data.get("discount_value")

        if discount_value is not None:
            if discount_value <= 0:
                raise serializers.ValidationError(
                    {"discount_value": "Discount value must be greater than zero."})

            if discount_type == "percentage" and discount_value > 100:
                raise serializers.ValidationError(
                    {"discount_value": "Percentage cannot exceed 100%."})

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
