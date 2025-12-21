from django.urls import path
from .views import SubmitTeacherProfileView

urlpatterns = [
    path('profile/', SubmitTeacherProfileView.as_view()),
]