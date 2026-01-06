from django.urls import path

from .views import *


urlpatterns = [
    

    # student login/logout
    
    path('login/',LoginView.as_view()),

    #student Register
    
    path('student/register/',StudentRegisterView.as_view()),
    path("student/forgot-password/",ForgotPasswordView.as_view()),
    path("student/reset-password/",ResetPasswordView.as_view()),

    # teacher login/logout

    path("teacher/login/", TeacherLogin.as_view()),
    

    #teacher_register
    path('teacher/register/',TeacherRegisterView.as_view()),

    #OTPs
    path('verify-otp/',VerifyOTPView.as_view()),
    path('resend-otp/',ResendOTPView.as_view()),


    



    # admin login/logout
    path('admin/login/',AdminLogin.as_view()),
    


    # GooleAuth

    path("google-login/",GoogleLoginView.as_view()),

    # LogoutUrls
    path("logout/", LogoutView.as_view()),
    

]
