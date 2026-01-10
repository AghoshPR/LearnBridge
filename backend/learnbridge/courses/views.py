from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from authapp.permissions import *
from rest_framework import status
from .models import Category,Course
from .serializers import CategorySerializer,CourseSerializer



# Create your views here.




# Admin CourseListView

class AdminCourseListView(APIView):

    permission_classes=[IsAdmin]

    def get(self, request):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        courses = Course.objects.all().order_by('-created_at')
        serializer = CourseSerializer(courses,many=True)
        return Response(serializer.data)




# Teacher create category


class TeacherCreateCategory(APIView):

    permission_classes = [IsTeacher]

    def post(self,request):

        if request.user.role != 'teacher':
            return Response(
                {"detail": "Only teachers can create categories"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


class TeacherCategoryListView(APIView):

    permission_classes=[IsTeacher]

    def get(self,request):

        if request.user.role != 'teacher':
            return Response(
                {"detail":"Only teacher allowed"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        categories = Category.objects.filter(
            created_by=request.user,
            status='active'
        )


        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data)
    
# Teacher Create Course


class TeacherCreateCourseView(APIView):

    permission_classes=[IsTeacher]

    def post(self,request):

        if request.user.role != 'teacher':
            return Response(
                {"detail": "Only teachers can create courses"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CourseSerializer(
            data=request.data,
            context={
                "request":request
            }
        )

        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


