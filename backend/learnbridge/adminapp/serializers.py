from rest_framework import serializers
from authapp.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password



class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "date_joined",
            "is_active",
        ]


class AdminCreateUserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)

    class Meta:

        model=User
        fields = ["username","email","password"]

    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_password(self, value):
            validate_password(value)
            return value

    
    def create(self, validated_data):
         
        user = User.objects.create_user(
             
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role="student",
            is_active=True,
            status="active"

        )
        return user