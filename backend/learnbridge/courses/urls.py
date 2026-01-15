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
    path('categories/unblock/<int:id>/',CategoryUnBlock.as_view())



]
