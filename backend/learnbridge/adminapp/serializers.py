from rest_framework import serializers
from authapp.models import User


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
    
    pass
