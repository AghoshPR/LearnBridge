from rest_framework import serializers
from .models import TeacherProfile


class TeacherProfileSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)
    resume = serializers.FileField(required=False, allow_null=True)
    account_number = serializers.CharField(source='bank_account_number', required=False, allow_blank=True)
    ifsc_code = serializers.CharField(source='ifse_code', required=False, allow_blank=True)

    class Meta:

        model = TeacherProfile
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "qualification",
            "subjects",
            "bio",
            "years_of_experience",
            "profile_image",
            "resume",
            "account_holder_name",
            "account_number",
            "ifsc_code",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.profile_image and hasattr(instance.profile_image, 'url'):
            representation['profile_image'] = instance.profile_image.url
        return representation

    def validate_phone(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError(
                "Enter valid 10-digit phone number")
        return value

    def validate_years_of_experience(self, value):
        if value < 0 or value > 50:
            raise serializers.ValidationError("Invalid experience")
        return value

    def validate_bio(self, value):
        if len(value) < 10:
            raise serializers.ValidationError(
                "Bio must be at least 20 characters")
        return value
