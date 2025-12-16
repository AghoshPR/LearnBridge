from django.urls import path

from .views import *


urlpatterns = [
    path('student/register/',StudentRegisterView.as_view()),
    path('teacher/register/',TeacherRegisterView.as_view()),
    path('login/',LoginView.as_view())
]
