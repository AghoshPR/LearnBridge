from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from django.core.cache import cache
from rest_framework import status
from .utils import send_otp


class StudentRegisterView(APIView):

    permission_classes=[AllowAny]

    def post(self,request):

        serializer = RegisterStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user=serializer.save()
        
        user.is_active=False
        user.save()

        send_otp(user.email)

        return Response({
            "message":"OTP send to email",
            "email":user.email
        })


class TeacherRegisterView(APIView):

    permission_classes=[AllowAny]


    def post(self,request):

        serializer=RegisterTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user=serializer.save()

        send_otp(user.email)

        return Response({
            "message":"OTP sent. Please verify. Waiting for admin approval after verification",
            "email":user.email
        })


        

    
class LoginView(APIView):

    permission_classes=[AllowAny]

    def post(self,request):

        serializer=LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        response =  Response({
            "message": "Login successful",
            "role": user.role,
            "username": user.username
        })
    
        response.set_cookie(

            key="access_token",
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return Response

    
class VerifyOTPView(APIView):

    permission_classes=[AllowAny]


    def post(self,request):

        email=request.data.get('email')
        otp=request.data.get('otp')

        cached_otp = cache.get(f'otp:{email}')

        if not cached_otp:
            return Response(
                {"error":"OTP expired or not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if cached_otp != otp:

            return Response(
                {"error":"invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
                    
            )
        

        try:

            user = User.objects.get(email=email)
            user.is_active=True
            user.save()
            cache.delete(f'otp:{email}')
        
        except User.DoesNotExist:
            return Response(
                {"error":"User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {"message":"Account verified successfully"},
            status=status.HTTP_200_OK
        )

class ResendOTPView(APIView):

    permission_classes=[AllowAny]


    def post(self,request):

        email = request.data.get('email')

        if not User.objects.filter(email=email).exists():

            return Response(
                {"error":"User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        send_otp(email)

        return Response(
            {"message":"OTP resent successfully"},
            status=status.HTTP_200_OK
        )
