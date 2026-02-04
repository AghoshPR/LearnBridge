from rest_framework import serializers
from .models import TeacherProfile





class TeacherProfileSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="user.username",read_only=True)
    email=serializers.EmailField(source="user.email",read_only=True)
    profile_image = serializers.SerializerMethodField()
    resume = serializers.FileField(required=False, allow_null=True)
    

    class Meta:

        model = TeacherProfile
        fields=[
            "id",
            "name",
            "email",
            "phone",
            "qualification",
            "subjects",
            "bio",
            "years_of_experience",
            "profile_image",
            "resume"
        ]

    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None
    
    def validate_phone(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Enter valid 10-digit phone number")
        return value

    def validate_years_of_experience(self, value):
        if value < 0 or value > 50:
            raise serializers.ValidationError("Invalid experience")
        return value

    def validate_bio(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Bio must be at least 20 characters")
        return value
    
    
   