from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from teacherapp.models import TeacherProfile
from django.core.cache import cache
from rest_framework import status
from .utils import (
    send_student_register_otp,
    send_teacher_register_otp,
    send_student_reset_otp,
    send_teacher_reset_otp,
)
from .authentication import CsrfExemptSessionAuthentication, CookieJWTAuthentication
from django.contrib.auth.hashers import make_password
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import requests as py_requests
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.exceptions import TokenError
from authapp.tasks import (
    send_student_register_otp_task,
    send_teacher_register_otp_task,
    send_student_reset_otp_task,
    send_teacher_reset_otp_task,
)


class TeacherRegisterView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterTeacherSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()

                

                try:
                    send_teacher_register_otp_task.delay(user.email)
                except Exception as e:
                    print("Celery failed, fallback to direct OTP:", e)
                    send_teacher_register_otp(user.email)

                return Response({
                    "message": "OTP sent. Please verify. Waiting for admin approval after verification",
                    "email": user.email
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data

                if not user.is_active:
                    return Response(
                        {"error": "Account not verified or deactivated"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                if user.status == "blocked":
                    return Response(
                        {"error": "Your account is blocked. Contact admin."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                refresh = RefreshToken.for_user(user)

                response = Response({
                    "message": "Login successful",
                    "role": user.role,
                    "username": user.username
                })

                response.set_cookie(
                    key="access_token",
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite="Lax"
                )

                response.set_cookie(
                    key="refresh_token",
                    value=str(refresh),
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite="Lax"
                )

                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentRegisterView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]

    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterStudentSerializer(data=request.data)
            if serializer.is_valid():

                user = serializer.save()
                user.is_active = False
                user.save()

                try:
                    send_student_register_otp_task.delay(user.email)
                except Exception as e:
                    print("Celery OTP Failed:", e)
                    send_student_register_otp(user.email)

                return Response({
                    "message": "OTP send to email",
                    "email": user.email
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            otp = request.data.get("otp")

            cached_otp = cache.get(f"otp:{email}")

            if not cached_otp:
                return Response(
                    {"error": "OTP expired or not found"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if str(cached_otp).strip() != str(otp).strip():
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
                secure=not settings.DEBUG,     
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"
            )

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendOTPView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        try:
            email = request.data.get('email')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                if not user.is_active:
                    if user.role == 'teacher':
                        send_teacher_register_otp_task.delay(email)
                    else:
                        send_student_register_otp_task.delay(email)
                else:
                    if user.role == 'teacher':
                        send_teacher_reset_otp_task.delay(email)
                    else:
                        send_student_reset_otp_task.delay(email)
            except Exception as e:
                print("Celery OTP Failed:", e)
                if not user.is_active:
                    if user.role == 'teacher':
                        send_teacher_register_otp(email)
                    else:
                        send_student_register_otp(email)
                else:
                    if user.role == 'teacher':
                        send_teacher_reset_otp(email)
                    else:
                        send_student_reset_otp(email)


            return Response(
                {"message": "OTP resent successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        try:
            email = request.data.get("email")

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                if user.role == 'teacher':
                    send_teacher_reset_otp_task.delay(email)
                else:
                    send_student_reset_otp_task.delay(email)
            except Exception as e:
                print("Celery OTP Failed:", e)
                if user.role == 'teacher':
                    send_teacher_reset_otp(email)
                else:
                    send_student_reset_otp(email)

            return Response({
                "message": "OTP send for password reset",
                "email": email
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            confirm_password = request.data.get("confirm_password")

            if password != confirm_password:
                return Response(
                    {"error": "Password do not match"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            user.password = make_password(password)
            user.save()

            return Response(
                {"message": "Password reset successful"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin Login


class AdminLogin(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not user.is_superuser:
                return Response(
                    {"error": "Not admin account"},
                    status=status.HTTP_403_FORBIDDEN
                )

            user = authenticate(
                username=user.username,
                password=password
            )

            if not user:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Admin Login successful",
                "role": "admin"
            })

            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"
            )

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Teacher Login

class TeacherLogin(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

            if user.role != "teacher":
                return Response({"error": "Not a teacher account"}, status=status.HTTP_403_FORBIDDEN)

            if not user.is_active:
                return Response({"error": "Account not verified"}, status=status.HTTP_403_FORBIDDEN)

            user = authenticate(username=user.username, password=password)

            if not user:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                TeacherProfile.objects.get(user=user)
            except TeacherProfile.DoesNotExist:
                return Response({"error": "Teacher Profile not found"}, status=status.HTTP_403_FORBIDDEN)

            if user.status == "blocked":
                return Response({"error": "Account is blocked"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Teacher login successful",
                "role": "teacher",
                "username": user.username
            })

            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"
            )

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Google Authentication

class GoogleLoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        try:
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

                # Role mismatch protection
                if user.role != role:
                    return Response(
                        {"error": f"This email is registered as {user.role}"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Blocked user protection
                if user.status == "blocked":
                    return Response(
                        {"error": "Account is blocked"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Generate JWT tokens
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
                    secure=not settings.DEBUG,
                    samesite="Lax"
                )

                response.set_cookie(
                    key="refresh_token",
                    value=str(refresh),
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite="Lax"
                )

                return response

            except ValueError:
                return Response(
                    {"error": "Invalid Google token"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RefreshTokenView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh toekn"}, status=401)

        try:

            refresh = RefreshToken(refresh_token)

            response = Response({"message": "Token refreshed"})

            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax"

            )

            return response

        except TokenError:
            return Response({"error": "Invalid refresh"}, status=401)


class LogoutView(APIView):
    authentication_classes = [
        CookieJWTAuthentication,
        CsrfExemptSessionAuthentication
    ]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    pass

            response = Response({"message": "Logged out successfully"})
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
