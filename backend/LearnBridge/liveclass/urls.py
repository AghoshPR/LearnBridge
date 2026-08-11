
from django.contrib import admin
from django.urls import path, include
from .views import *


urlpatterns = [
    path("teacher/liveclass/", TeacherLiveClassListView.as_view()),
    path("teacher/liveclass/<int:pk>/", TeacherLiveClassDetailView.as_view()),
    path("student/liveclass/upcoming/",
         StudentUpCommingLiveClassesView.as_view()),
    path("student/liveclass/live/",
         StudentLiveNowClassesView.as_view()),
    path("student/liveclass/past/",
         StudentPastLiveClassesView.as_view()),
    # liveclass/urls.py

    path("student/liveclass/razorpay/create/",
         CreateLiveClassRegistrationPayment.as_view()),
    path("student/liveclass/razorpay/verify/",
         VerifyLiveClassPaymentView.as_view()),

    path("student/liveclass/room/<int:class_id>/",
         LiveClassRoomAccessView.as_view())

]
