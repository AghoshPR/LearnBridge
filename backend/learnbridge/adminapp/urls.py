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
    

    
    

    # admin user

    path("users/", AdminUsers.as_view()),
    path("users/create/", AdminCreateUser.as_view()),
    path("users/<int:user_id>/block/", BlockUser.as_view()),
    path("users/<int:user_id>/unblock/", UnBlockUser.as_view()),
    path("users/<int:user_id>/delete/", DeleteUserView.as_view()),


    # admin teacher

    path("teachers/create/", AdminCreateTeacher.as_view()),
    path("teachers/block/<int:id>/", BlockTeacherView.as_view()),
    path("teachers/unblock/<int:id>/", UnBlockTeacherView.as_view()),
    path("teachers/reject/<int:teacher_id>/",AdminTeacherRejectView.as_view()),
    path("teachers/delete/<int:id>/", AdminTeacherDeleteView.as_view()),


    


]