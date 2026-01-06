from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from teacherapp.models import TeacherProfile 
from django.core.cache import cache
from rest_framework import status
from .utils import send_otp
from .authentication import CsrfExemptSessionAuthentication,CookieJWTAuthentication
from django.contrib.auth.hashers import make_password
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import requests as py_requests
from django.contrib.auth.password_validation import validate_password



class TeacherRegisterView(APIView):

    authentication_classes=[CsrfExemptSessionAuthentication]
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

    authentication_classes=[CsrfExemptSessionAuthentication]
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
            value=str(refresh.access_token),
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

        return response
    
class StudentRegisterView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]

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


    
class VerifyOTPView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        cached_otp = cache.get(f"otp:{email}")

        if not cached_otp:
            return Response(
                {"error": "OTP expired or not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if cached_otp != otp:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
            cache.delete(f"otp:{email}")
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        
        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "message": "Account verified successfully",
                "role": user.role
            },
            status=status.HTTP_200_OK
        )

        
        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,      # True in production
            samesite="Lax"
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return response

        

class ResendOTPView(APIView):

    permission_classes=[AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]


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
    


class ForgotPasswordView(APIView):

    permission_classes=[AllowAny]
    authentication_classes=[CsrfExemptSessionAuthentication]

    def post(self,request):

        email=request.data.get("email")

        try:

            User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error":"User not found"},status=404)
        
        send_otp(email)

        return Response({
            "message":"OTP send for password reset",
            "email":email
        })
    
class ResetPasswordView(APIView):

    authentication_classes=[CsrfExemptSessionAuthentication]
    permission_classes=[AllowAny]

    def post(self,request):

        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password=request.data.get("confirm_password")

        if password != confirm_password:

            return Response(
                {"error":"Password do not match"},
                status=status.HTTP_400_BAD_REQUEST

            )
        
        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {"error":"User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        user.password=make_password(password)
        user.save()

        return Response(
            {"message":"Password reset successful"},
            status=status.HTTP_200_OK
        )



# Admin Login 


class AdminLogin(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self,request):

        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user=User.objects.get(email=email)

        except User.DoesNotExist:

            return Response(
                {"error":"Invalid credetials"},
                status=400
            )
        
        if not user.is_superuser:
            return Response(
                {"error":"Not admin account"},
                status=403
            )
        
        user=authenticate(
            username=user.username,
            password=password
        )


        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=400
            )
        
        refresh=RefreshToken.for_user(user)

        response=Response({
            "message":"Admin Login successful",
            "role":"admin"
        })

        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
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


        return response
    


    
# Teacher Login

class TeacherLogin(APIView):
    
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes=[AllowAny]

    def post(self,request):

        email = request.data.get("email")
        password = request.data.get("password")


        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response({"error":"Invalid Credentials"},status=400)
        

        if user.role !="teacher":
            return Response({"error":"Not a teacher account"},status=403)
        
        if not user.is_active:
            return Response({"error":"Account not verified"},status=403)
        

        user = authenticate(username=user.username,password=password)

        if not user:
            return Response({"error":"Invalid credentials"},status=400)
        
        try:

            TeacherProfile.objects.get(user=user)

        except TeacherProfile.DoesNotExist:
            return Response({"error":"Teacher Profile not found"},status=403)
        

        if user.status == "blocked":
            return Response({"error":"Account is blocked"},status=403)
        
        refresh =  RefreshToken.for_user(user)

        response = Response({
            "message":"Teacher login successful",
            "role":"teacher",
            "username":user.username

        })


        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            samesite="Lax"

        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            samesite="Lax"
        )

        return response
        




    


# Google Authentication

class GoogleLoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        role = request.data.get("role", "student")

        if not token:
            return Response(
                {"error": "Token not provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            name = idinfo.get("name", "")

            if not email:
                return Response(
                    {"error": "Email not found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not idinfo.get("email_verified"):
                return Response(
                    {"error": "Google email not verified"},
                    status=status.HTTP_400_BAD_REQUEST
    )


            
            first_name = ""
            last_name = ""

            if name:
                parts = name.split(" ", 1)
                first_name = parts[0]
                if len(parts) > 1:
                    last_name = parts[1]

            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0],
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": role,
                    "is_active": True,
                }
            )

            #  Role mismatch protection
            if user.role != role:
                return Response(
                    {"error": f"This email is registered as {user.role}"},
                    status=status.HTTP_403_FORBIDDEN
                )

            #  Blocked user protection
            if user.status == "blocked":
                return Response(
                    {"error": "Account is blocked"},
                    status=status.HTTP_403_FORBIDDEN
                )

            #  Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Google login successful",
                "role": user.role,
                "username": user.username,
            })

            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                samesite="Lax"
            )

            return response

        except ValueError:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        

class LogoutView(APIView):
    authentication_classes = [
        CookieJWTAuthentication,
        CsrfExemptSessionAuthentication
    ]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response