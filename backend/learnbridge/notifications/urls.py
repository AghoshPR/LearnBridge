
from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
  

    path("notification/",NotificationListView.as_view()),
    path("notification/mark-read/<int:pk>/",MarkAllNotificationsReadView.as_view()),
    path("notification/mark-all-read/",MarkAllNotificationsReadView.as_view()),
    path("notification/delete/<int:pk>/",DeleteNotificationView.as_view()),
    


]
