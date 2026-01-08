from django.urls import path
from .views import *

urlpatterns = [
    path('profile/', SubmitTeacherProfileView.as_view()),
    path('profileview/',TeacherProfileView.as_view())
]