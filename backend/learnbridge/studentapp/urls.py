from django.urls import path
from .views import StudentProfile



urlpatterns = [
    path("profile/",StudentProfile.as_view())
]
