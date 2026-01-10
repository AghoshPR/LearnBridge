from django.urls import path
from .views import *

urlpatterns = [


    # admin courses

    path('admin/courses/', AdminCourseListView.as_view()),
    

    # Teacher Categpry

    path('categories/create/',TeacherCreateCategory.as_view()),
    path('categories/',TeacherCategoryListView.as_view()),
    
    
    # Teacher Create Course

    path('course/create',TeacherCreateCourseView.as_view())


]
