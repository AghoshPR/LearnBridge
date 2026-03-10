from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication
from authapp.models import User
from rest_framework import status
from .models import Wishlist
from .serializers import *
from courses.models import Course
from studentapp.models import *
from courses.utils import generate_signed_url

# Create your views here.


class StudentProfile(APIView):

    authentication_classes = [
        CookieJWTAuthentication, CsrfExemptSessionAuthentication]

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            total_enrolled = Enrollment.objects.filter(user=user).count()
            completed = Enrollment.objects.filter(
                user=user, status='completed').count()
            in_progress = Enrollment.objects.filter(
                user=user, status='in_progress').count()

            return Response({
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "address": user.address,
                "profile_image": user.profile_image.url if user.profile_image else None,
                "stats": {
                    "enrolled": total_enrolled,
                    "completed": completed,
                    "in_progress": in_progress,
                }
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            user = request.user
            serializer = StudentProfileSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Profile updated successfully",
                    "profile_image": user.profile_image.url if user.profile_image else None
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WishlistListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            items = Wishlist.objects.filter(user=request.user)
            serializer = WishlistSerializer(items, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WishlistAddView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            course_id = request.data.get("course_id")
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

            obj, created = Wishlist.objects.get_or_create(
                user=request.user,
                course=course
            )

            if not created:
                return Response({"detail": "Already in wishlist"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Added to wishlist"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WishlistRemoveView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id):
        try:
            Wishlist.objects.filter(
                user=request.user, course_id=course_id).delete()
            return Response({"detail": "Removed from wishlist"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MyCourseView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            enrollments = Enrollment.objects.filter(user=request.user)
            serializer = MyCourseSerializer(enrollments, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# course video view

class StudentCourseLessonsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            enrolled = Enrollment.objects.filter(
                user=request.user,
                course_id=course_id
            ).exists()

            if not enrolled:
                return Response({"error": "Not enrolled"}, status=status.HTTP_403_FORBIDDEN)

            lessons = Lesson.objects.filter(course_id=course_id)
            serializer = StudentLessonSerializer(lessons, many=True)

            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentLessonVideoView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            try:
                lesson = Lesson.objects.select_related(
                    "course").get(id=lesson_id)
            except Lesson.DoesNotExist:
                return Response(
                    {"error": "Lesson not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # checking enrollment
            enrolled = Enrollment.objects.filter(
                user=request.user,
                course=lesson.course
            ).exists()

            if not enrolled:
                return Response(
                    {"error": "Not enrolled in this course"},
                    status=status.HTTP_403_FORBIDDEN
                )

            if not lesson.video_key:
                return Response(
                    {"error": "Video not uploaded"},
                    status=status.HTTP_404_NOT_FOUND
                )

            signed_url = generate_signed_url(lesson.video_key)

            return Response({
                "signed_url": signed_url
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CourseEnrollmentStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            enrollment = Enrollment.objects.get(
                user=request.user, course_id=course_id)
            return Response({"status": enrollment.status})
        except Enrollment.DoesNotExist:
            return Response({"error": "Not enrolled"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, course_id):
        try:
            enrollment = Enrollment.objects.get(
                user=request.user, course_id=course_id)
            if enrollment.status == "in_progress":
                enrollment.status = "completed"
            else:
                enrollment.status = "in_progress"
            enrollment.save()
            return Response({"status": enrollment.status})
        except Enrollment.DoesNotExist:
            return Response({"error": "Not enrolled"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
