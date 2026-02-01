from django.urls import path
from .views import *



urlpatterns = [
    path("profile/",StudentProfile.as_view()),
    path("wishlist/",WishlistListView.as_view()),
    path("wishlist/add/",WishlistAddView.as_view()),
    path("wishlist/remove/<int:course_id>/",WishlistRemoveView.as_view()),


    # course view

    path("mycourses/",MyCourseView.as_view()),

    path("courses/<int:course_id>/lessons/",StudentCourseLessonsView.as_view()),
    path("lessons/<int:lesson_id>/video/", StudentLessonVideoView.as_view()),


]
