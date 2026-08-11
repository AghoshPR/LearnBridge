from django.urls import path
from .views import AskGeminiView

urlpatterns = [
    path("ai/ask/", AskGeminiView.as_view()),
]
