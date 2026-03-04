from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import TeacherProfileSerializer
from .models import TeacherProfile
from rest_framework import status
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import *
from django.utils import timezone
from courses.models import Course, CourseReview
from liveclass.models import LiveClass, LiveClassRegistration
from studentapp.models import Enrollment


class SubmitTeacherProfileView(APIView):

    authentication_classes = [
        CookieJWTAuthentication,
        CsrfExemptSessionAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        user = request.user

        print("USER:", request.user)
        print("AUTH:", request.user.is_authenticated)

        if user.role != 'teacher':
            return Response(
                {'error': 'Only teacher can submit profile'}, status=403)

        if hasattr(user, 'teacher_profile'):
            return Response(
                {'error': 'Profile already submitted'}, status=400)

        serializer = TeacherProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        return Response({
            "message": "Profile sumbitted successfully. Waiting for admin approval"
        })


class TeacherProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:

            profile = request.user.teacher_profile

        except TeacherProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TeacherProfileSerializer(profile)

        return Response(serializer.data)

    def patch(self, request):

        profile, created = TeacherProfile.objects.get_or_create(
            user=request.user
        )

        serializer = TeacherProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Profile updated successfully"},
            status=status.HTTP_200_OK
        )



class TeacherDashboardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        # Total courses created by teacher
        teacher_courses = Course.objects.filter(teacher=user)
        total_courses = teacher_courses.count()

        # Total distinct students enrolled in teacher's courses
        total_students = Enrollment.objects.filter(course__teacher=user).values('user').distinct().count()

        # Total Live Classes scheduled by teacher
        teacher_live_classes = LiveClass.objects.filter(teacher__user=user)
        live_classes_count = teacher_live_classes.count()

        # Average course rating for teacher's courses
        avg_rating_agg = CourseReview.objects.filter(course__teacher=user).aggregate(Avg('rating'))
        avg_rating = round(avg_rating_agg['rating__avg'] or 0.0, 1)

        # Top 3 courses based on enrollments / revenue
        top_courses_qs = teacher_courses.annotate(
            student_count=Count('enrollments')
        ).order_by('-student_count')[:3]

        top_courses = []
        for c in top_courses_qs:
            revenue = sum([e.course.price for e in c.enrollments.all()])
            rating = round(c.reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0, 1)
            top_courses.append({
                "id": c.id,
                "title": c.title,
                "student_count": c.student_count,
                "revenue": revenue,
                "rating": rating
            })

        # Upcoming live classes (start time > now)
        upcoming_qs = teacher_live_classes.filter(start_time__gt=timezone.now()).order_by('start_time')[:2]
        upcoming_classes = []
        for cls in upcoming_qs:
            upcoming_classes.append({
                "id": cls.class_id,
                "title": cls.title,
                "start_time": cls.start_time,
                "registered_count": cls.registrations.count()
            })

        return Response({
            "total_courses": total_courses,
            "total_students": total_students,
            "live_classes_count": live_classes_count,
            "avg_rating": avg_rating,
            "top_courses": top_courses,
            "upcoming_classes": upcoming_classes
        })
