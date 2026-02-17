

from django.urls import path
from .views import *



   
urlpatterns = [
    path('tags/', AdminTagListView.as_view()),
    path('tags/create/', AdminTagCreateView.as_view()),
    path('tags/<int:pk>/update/', AdminTagUpdateView.as_view()),
    path('tags/<int:pk>/delete/', AdminTagDeleteView.as_view()),
]


