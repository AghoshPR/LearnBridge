from django.urls import path
from .views import *

urlpatterns = [


    # admin courses

    path('admin/courses/', AdminCourseListView.as_view()),
    

    # Teacher Categpry

    path('categories/', TeacherCategoryView.as_view()),
    path('categories/<int:pk>/', TeacherCategoryView.as_view()),

    
    
    # Teacher Create Course

    path('mycourses/',TeacherCourseView.as_view()),
    path('mycourses/<int:pk>/',TeacherCourseView.as_view())



]
