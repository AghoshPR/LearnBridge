from django.urls import path

from .views import *


urlpatterns = [
    
    #student
    path('student/register/',StudentRegisterView.as_view()),

    #teacher
    path('teacher/register/',TeacherRegisterView.as_view()),

    #OTPs
    path('verify-otp/',VerifyOTPView.as_view()),
    path('resend-otp/',ResendOTPView.as_view()),



    path('login/',LoginView.as_view())
]
