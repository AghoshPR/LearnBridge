from rest_framework.views import APIView
from rest_framework.response import Response
from authapp.permissions import *
from rest_framework import status
from .models import Category,Course
from .serializers import CategorySerializer,CourseSerializer
from django.shortcuts import get_object_or_404
from authapp.permissions import *



# Create your views here.


# Admin CategoryView

class AdminCategoryView(APIView):

    permission_classes=[IsAdmin]

    def get(self,request):

        categories = Category.objects.all().order_by('-created_at')
        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data)
    
    def patch(self,request,pk):

        category = get_object_or_404(Category,pk=pk)

        serializer = CategorySerializer(
            category,
            data=request.data,
            partial = True,
            context = {'request':request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self,request,pk):
        
        category = get_object_or_404(Category,pk=pk)
        category.delete()

        return Response(
            {"detail":"Category deleted"},
            status=status.HTTP_204_NO_CONTENT
        )

class AdminCategoryToggleStatus(APIView):

    permission_classes=[IsAdmin]

    def post(self,request,pk):

        category = get_object_or_404(Category,pk=pk)

        category.status = 'blocked' if category.status == 'active' else 'active'
        category.save()

        return Response(
            {
                "message":"Category status updated",
                "status":category.status
            },
            status=status.HTTP_200_OK
        )










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


class TeacherCategoryView(APIView):

    permission_classes = [IsTeacher]


    def get(self,request):

        if request.user.role == 'admin':
            categories = Category.objects.all()
        else:
            categories = Category.objects.filter(created_by=request.user)


        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data)
    

    # Create category
    def post(self,request):

        if request.user.role != 'teacher':
            return Response(
                {"detail": "Only teachers can create categories"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CategorySerializer(data=request.data,context={"request": request})

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    # Edit category

    def patch(self,request,pk=None):

        category = get_object_or_404(
            Category,
            pk=pk,
            created_by=request.user
        )

        serializer = CategorySerializer(
            category,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk=None):

        category = get_object_or_404(
            Category,
            pk=pk,
            created_by=request.user
        )

        category.delete()
        return Response(

            {"detail":"Category deleted"},
             status=status.HTTP_204_NO_CONTENT
        )

# Category Block

class CatgeoryBlock(APIView):
    
    permission_classes = [IsTeacher]

    def post(self,request,id):
        
        category = get_object_or_404(
            Category,
            id=id,
            created_by=request.user
        )

        # if category.status =='blocked':

        #     return Response(
        #         {"error":"Category is already blocked"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        
        # if category.courses.exists():
        #     return Response(
        #         {"error": "Cannot block category with existing courses"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        category.status = 'blocked'
        category.save()

        return Response(
            {"message":"Category blocked successfully"},
            status=status.HTTP_200_OK
        )
class CategoryUnBlock(APIView):

    permission_classes=[IsTeacher]


    def post(self,request,id):

        category = get_object_or_404(
            Category,
            id=id,
            created_by=request.user

        )

        if category.status == 'active':

            return Response(
                {"error":"Category is already active"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        category.status='active'
        category.save()

        return Response(
            {"message":"Category unblocked successfully"},
            status=status.HTTP_200_OK
        )



# Teacher Create Course


class TeacherCourseView(APIView):

    permission_classes=[IsTeacher]

    # view all courses
    def get(self,request,pk=None):

        # SINGLE COURSES

        if pk:
            courses = get_object_or_404(Course,pk=pk,teacher=request.user)
            serialzer = CourseSerializer(courses)
            return Response(serialzer.data)
        
        #  ALL COURSES
        
        courses = Course.objects.filter(teacher=request.user)
        serialzer = CourseSerializer(courses,many=True)
        return Response(serialzer.data)
    

    # Creating Course

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


    def patch(self,request,pk):

        course = get_object_or_404(
            Course,
            pk=pk,
            teacher=request.user
        )

        serializer = CourseSerializer(
            course,
            data=request.data,
            partial=True,
            context={"request":request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self,request,pk):

        course = get_object_or_404(
            Course,
            pk=pk,
            teacher=request.user
        )

        course.delete()
        return Response(
            {"detail":"Course deleted"},
            status=status.HTTP_204_NO_CONTENT
        )
    


