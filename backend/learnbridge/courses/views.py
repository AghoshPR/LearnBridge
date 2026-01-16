from rest_framework.views import APIView
from rest_framework.response import Response
from authapp.permissions import *
from rest_framework import status
from courses.models import Category,Course,Lesson
from .serializers import CategorySerializer,CourseSerializer,LessonSerializer
from django.shortcuts import get_object_or_404
from courses.utils import upload_video,generate_signed_url,delete_video_from_s3
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max



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

class AdminCourseView(APIView):

    permission_classes=[IsAdmin]

    def get(self, request,pk=None):

        if pk:

            course = get_object_or_404(Course,pk=pk)
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        
        courses = Course.objects.select_related('teacher','category').order_by('-created_at')

        serializer = CourseSerializer(courses,many=True)
        return Response(serializer.data)

    def post(self,request):

        serializer = CourseSerializer(
            data=request.data,
            context = {'request':request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self,request,pk):

        course = get_object_or_404(Course, pk=pk)

        serializer = CourseSerializer(
            course,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self,request,pk):
        course = get_object_or_404(Course,pk=pk)
        course.delete()

        return Response(
            {"detail":"Course deleted"},
            status=status.HTTP_204_NO_CONTENT
        )


class AdminCourseToggleStatus(APIView):
    

    permission_classes=[IsAdmin]

    def post(self,request,pk):

        course = get_object_or_404(Course,pk=pk)

        course.status = 'blocked' if course.status == 'active' else 'active'

        course.save()

        return Response(
            {
                "message":"Course status updated",
                "status":course.status
            },
            status=status.HTTP_200_OK
        )



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
    

class TeacherLessonCreateView(APIView):

    permission_classes=[IsTeacher]


    def get(self,request,course_id):

        lessons = Lesson.objects.filter(course_id=course_id).order_by("position")
        serializer = LessonSerializer(lessons,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


    def post(self,request,course_id):

        title=request.data.get('title')
        duration = request.data.get("duration")
        description = request.data.get("description","")
        video = request.FILES.get("video")


        if not video:

            return Response(
                {"error":"video file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        last_position = (
            Lesson.objects.filter(course_id=course_id)
            .aggregate(max_pos=Max("position"))
            .get("max_pos") or 0
        )

        
        video_key = upload_video(video,course_id)

        Lesson.objects.create(

            course_id=course_id,
            title=title,
            duration=duration,
            video_key=video_key,
            description=description,
            type="video",
            position=last_position + 1,
        )

        return Response(
            {"message":"Lesson uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

class TeacherLessonDetailedView(APIView):

    permission_classes=[IsTeacher]

    def patch(self,request,lesson_id):

        lesson = get_object_or_404(Lesson,id=lesson_id)

        title = request.data.get("title")
        duration = request.data.get("duration")
        description = request.data.get("description","")
        video = request.FILES.get("video")

        if not title or not duration:

            return Response(
                {"error":"Title and duration are required"},
                status=status.HTTP_400_BAD_REQUEST

            )
        
        lesson.title = title
        lesson.duration = duration
        lesson.description = description

        if video:
            old_key=lesson.video_key
            new_key = upload_video(video,lesson.course_id)
            lesson.video_key = new_key

            delete_video_from_s3(old_key)
        
        lesson.save()

        return Response(
            {"message":"Lesson updated successfully"},
            status=status.HTTP_200_OK
        )
    
    def delete(self,request,lesson_id):

        lesson = get_object_or_404(Lesson,id=lesson_id)

        delete_video_from_s3(lesson.video_key)
        lesson.delete()

        return Response(
            {"message":"Lesson deleted successfully"},
            status==status.HTTP_204_NO_CONTENT
        )


class StudentLessonVideoView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self,request,lesson_id):

        lesson = Lesson.objects.get(id=lesson_id)

        signed_url = generate_signed_url(lesson.video_key)

        return Response(
            {"signed_url":signed_url}
        )

    
