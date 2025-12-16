from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import *



class RegisterStudentSerializer(serializers.ModelSerializer):

    class Meta:
        models=User
        fields=('username','email','password')

    def create(self,validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='student',
        )

        return user

class RegisterTeacherSerializer(serializers.ModelSerializer):

    class Meta:

        model=User
        fields=('username','email','password')

    
    def create(self,validated_data):

        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='teacher',
            is_active=True
        )
        return user

class LoginSerializer(serializers.Serializer):

    email=serializers.EmailField()
    password=serializers.CharField()
    role=serializers.CharField()


    def validate(self,data):

        user=authenticate(
            username=data['email'],
            password=data['password']

        )
        
    
        if not user:

            raise serializers.ValidationError("Invalid Credentials")

        if user.role != data['role']:
            raise serializers.ValidationError('Role Mismatch')
    
        if user.role == 'teacher' and user.status !='active':
            raise serializers.ValidationError("Teacher not Approved")

        return user
    

