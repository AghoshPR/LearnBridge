from django.urls import path
from .views import *

urlpatterns = [
    # GET → list pending teachers
    path("teachers/pending/", PendingTeachersView.as_view()),

    # GET → list approved teachers
    path("teachers/approved/", ApproveTeacherView.as_view()),

    # POST → approve teacher
    path("teachers/approve/<int:id>/", ApproveTeacherView.as_view()),

    # POST → reject teacher
    path("teachers/reject/<int:id>/", RejectTeacherView.as_view()),

    # POST → block teacher
    path("teachers/block/<int:id>/", BlockTeacherView.as_view()),

    # POST → unblock teacher
    path("teachers/unblock/<int:id>/", UnBlockTeacherView.as_view()),
]