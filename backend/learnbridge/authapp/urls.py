from django.urls import path

from .views import *


urlpatterns = [
    

    # student login/logout
    
    path('login/',LoginView.as_view()),

    #student Register
    
    path('student/register/',StudentRegisterView.as_view()),

    # teacher login/logout

    path("teacher/login/", TeacherLogin.as_view()),
    path("teacher/logout/",TeacherLogout.as_view()),

    #teacher_register
    path('teacher/register/',TeacherRegisterView.as_view()),

    #OTPs
    path('verify-otp/',VerifyOTPView.as_view()),
    path('resend-otp/',ResendOTPView.as_view()),


    



    # admin login/logout
    path('admin/login/',AdminLogin.as_view()),
    path("admin/logout/", AdminLogout.as_view()),
    

]
