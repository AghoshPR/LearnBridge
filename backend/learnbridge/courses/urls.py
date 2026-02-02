from django.urls import path
from .views import *


urlpatterns = [


    # admin courses

    path('admin/courses/', AdminCourseView.as_view()),
    path('admin/courses/<int:pk>/',AdminCourseView.as_view()),
    path('admin/courses/toggle/<int:pk>/',AdminCourseToggleStatus.as_view()),




    # admin category


    path('admin/categories/', AdminCategoryView.as_view()),
    path('admin/categories/<int:pk>/',AdminCategoryView.as_view()),
    path('admin/categories/toggle/<int:pk>/', AdminCategoryToggleStatus.as_view()),

    
    

    # Teacher Category

    path('categories/', TeacherCategoryView.as_view()),
    path('categories/<int:pk>/', TeacherCategoryView.as_view()),

    
    
    # Teacher Create Course

    path('mycourses/',TeacherCourseView.as_view()),
    path('mycourses/<int:pk>/',TeacherCourseView.as_view()),

    path('categories/block/<int:id>/',CatgeoryBlock.as_view()),
    path('categories/unblock/<int:id>/',CategoryUnBlock.as_view()),

    # Teacher Add lesson

    # teacher uploads video
    path('teacher/courses/<int:course_id>/lessons/',TeacherLessonCreateView.as_view(),name="teacher-add-lesson"),
    path("teacher/lessons/<int:lesson_id>/",TeacherLessonDetailView.as_view(),name="teacher-edit-delete-lesson"),

    # student plays video

    path(
        "student/lessons/<int:lesson_id>/video/",
        StudentLessonVideoView.as_view(),
        name="student-play-lesson"
    ),


    # Course 

    path("public/",PublicCourseListView.as_view()),
    path("categories/public/", PublicCategoryListView.as_view()),
    path("public/<int:pk>/",PublicCourseDetailView.as_view()),

    # comments

    path("lessons/comments/<int:lesson_id>/",LessonCommentsView.as_view(),name="lesson_comments"),

    path("comments/reply/<int:comment_id>/",ReplyCommentsView.as_view(),name="reply_comment"),

    path("comments/<int:comment_id>/",DeleteCommentView.as_view(),name="delete_comment"),

    path("comments/like/<int:comment_id>/", ToggleCommentLikeView.as_view()),

    path("reviews/<int:course_id>/",CourseReviewView.as_view()),





]
