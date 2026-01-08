from rest_framework import serializers
from authapp.models import User

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


