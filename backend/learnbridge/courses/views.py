from rest_framework.views import APIView
from rest_framework.response import Response
from authapp.permissions import *
from rest_framework.permissions import AllowAny
from rest_framework import status
from courses.models import Category, Course, Lesson
from .serializers import *
from django.shortcuts import get_object_or_404
from courses.utils import upload_video, generate_signed_url, delete_video_from_s3
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max, Q
from .pagination import CoursePagination
from authapp.authentication import *
from adminapp.pagination import *
from studentapp.models import *
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.parsers import MultiPartParser, FormParser
# Create your views here.


# Admin CategoryView

class AdminCategoryView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            search = request.GET.get("search", "").strip()
            categories = Category.objects.filter(
                is_deleted=False).order_by('-created_at')

            if search:
                categories = categories.filter(
                    Q(name__icontains=search) |
                    Q(description__icontains=search)
                )

            paginator = AdminCategoryPagination()
            page = paginator.paginate_queryset(categories, request)

            serializer = CategorySerializer(page, many=True)

            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = CategorySerializer(
                data=request.data,
                context={"request": request}
            )

            if serializer.is_valid():
                serializer.save(created_by=request.user)
                return Response(serializer.data, status=201)

            return Response(serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)

            serializer = CategorySerializer(
                category,
                data=request.data,
                partial=True,
                context={'request': request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            category.is_deleted = True
            category.save()

            return Response(
                {"detail": "Category deleted"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminCategoryToggleStatus(APIView):

    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)

            category.status = 'blocked' if category.status == 'active' else 'active'
            category.save()

            return Response(
                {
                    "message": "Category status updated",
                    "status": category.status
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin CourseListView

class AdminCourseView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, pk=None):
        try:
            if pk:
                course = get_object_or_404(Course, pk=pk)
                serializer = CourseSerializer(course)
                return Response(serializer.data)

            search = request.GET.get("search", "")

            courses = Course.objects.select_related('teacher', 'category').filter(
                is_deleted=False).order_by('-created_at')

            if search:
                courses = courses.filter(
                    Q(title__icontains=search) |
                    Q(teacher__username__icontains=search) |
                    Q(category__name__icontains=search)
                )

            paginator = AdminCoursePagination()
            paginated_courses = paginator.paginate_queryset(courses, request)

            serializer = CourseSerializer(paginated_courses, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = CourseSerializer(
                data=request.data,
                context={'request': request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
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

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            course = get_object_or_404(Course, pk=pk)
            course.is_deleted = True
            course.save()

            return Response(
                {"detail": "Course deleted"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminCourseToggleStatus(APIView):

    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            course = get_object_or_404(Course, pk=pk)

            course.status = "blocked" if course.status == "published" else "published"

            course.save()

            return Response(
                {
                    "message": "Course status updated",
                    "status": course.status
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# admin course videos

class AdminLessonView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, course_id):
        try:
            lessons = Lesson.objects.filter(
                course_id=course_id,
                is_deleted=False,
            ).order_by("position")

            serializer = LessonSerializer(lessons, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminLessonDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            lesson = get_object_or_404(Lesson, pk=pk)
            lesson.is_deleted = True
            lesson.save()

            return Response(
                {"detail": "Lesson deleted"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Teacher create category


class TeacherCategoryView(APIView):

    permission_classes = [IsTeacher]

    def get(self, request):
        try:
            categories = Category.objects.filter(
                is_deleted=False, status="active")

            serializer = CategorySerializer(
                categories, many=True, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Create category
    def post(self, request):
        try:
            if request.user.role != 'teacher':
                return Response(
                    {"detail": "Only teachers can create categories"},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = CategorySerializer(
                data=request.data, context={"request": request})

            if serializer.is_valid():
                serializer.save(created_by=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Edit category

    def patch(self, request, pk=None):
        try:
            category = get_object_or_404(
                Category,
                pk=pk,
                created_by=request.user
            )

            serializer = CategorySerializer(
                category,
                data=request.data,
                partial=True,
                context={"request": request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk=None):
        try:
            category = get_object_or_404(
                Category,
                pk=pk,
                created_by=request.user
            )

            category.is_deleted = True
            category.save()
            return Response(
                {"detail": "Category deleted"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Category Block


class CatgeoryBlock(APIView):

    permission_classes = [IsTeacher]

    def post(self, request, id):
        try:
            category = get_object_or_404(
                Category,
                id=id,
                created_by=request.user
            )

            category.status = 'blocked'
            category.save()

            return Response(
                {"message": "Category blocked successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryUnBlock(APIView):

    permission_classes = [IsTeacher]

    def post(self, request, id):
        try:
            category = get_object_or_404(
                Category,
                id=id,
                created_by=request.user
            )

            if category.status == 'active':
                return Response(
                    {"error": "Category is already active"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            category.status = 'active'
            category.save()

            return Response(
                {"message": "Category unblocked successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Teacher Create Course


class TeacherCourseView(APIView):

    permission_classes = [IsTeacher]

    # view all courses
    def get(self, request, pk=None):
        try:
            # SINGLE COURSES
            if pk:
                courses = get_object_or_404(
                    Course, pk=pk, teacher=request.user, is_deleted=False)
                serialzer = CourseSerializer(courses)
                return Response(serialzer.data)

            #  ALL COURSES
            courses = Course.objects.filter(
                teacher=request.user, is_deleted=False)
            serialzer = CourseSerializer(
                courses, many=True, context={"request": request})
            return Response(serialzer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Creating Course

    def post(self, request):
        try:
            if request.user.role != 'teacher':
                return Response(
                    {"detail": "Only teachers can create courses"},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = CourseSerializer(
                data=request.data,
                context={
                    "request": request
                }
            )

            if serializer.is_valid():
                serializer.save(teacher=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            course = get_object_or_404(
                Course,
                pk=pk,
                teacher=request.user
            )

            serializer = CourseSerializer(
                course,
                data=request.data,
                partial=True,
                context={"request": request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            course = get_object_or_404(
                Course,
                pk=pk,
                teacher=request.user
            )

            course.is_deleted = True
            course.save()

            return Response(
                {"detail": "Course deleted"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherLessonCreateView(APIView):

    permission_classes = [IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, course_id):
        try:
            lessons = Lesson.objects.filter(
                course_id=course_id, is_deleted=False).order_by("position")
            serializer = LessonSerializer(lessons, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, course_id):
        try:
            title = request.data.get('title')
            duration = request.data.get("duration")
            description = request.data.get("description", "")
            video = request.FILES.get("video")

            if not video:
                return Response(
                    {"error": "video file is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            last_position = (
                Lesson.objects.filter(course_id=course_id)
                .aggregate(max_pos=Max("position"))
                .get("max_pos") or 0
            )

            try:
                video_key = upload_video(video, course_id)
            except Exception as e:
                import traceback
                traceback.print_exc()
                print("FULL ERROR:", str(e))
                return Response(
                    {"error": "Video upload failed"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            Lesson.objects.create(
                course_id=course_id,
                title=title,
                duration=duration,
                video_key=video_key,
                description=description,
                type="video",
                position=last_position + 1,
            )

            # notification
            try:
                channel_layer = get_channel_layer()
                enrollments = Enrollment.objects.filter(course_id=course_id)
                course = Course.objects.get(id=course_id)

                for enrollment in enrollments:
                    student = enrollment.user
                    notification = Notification.objects.create(
                        user=student,
                        title="Course Updated",
                        message=f"New lesson added to '{course.title}'",
                        notification_type="general"
                    )

                    async_to_sync(channel_layer.group_send)(
                        f"user_{student.id}",
                        {
                            "type": "send_notification",
                            "notification": {
                                "id": notification.id,
                                "title": notification.title,
                                "message": notification.message,
                                "is_read": notification.is_read,
                                "created_at": str(notification.created_at),
                            }
                        }
                    )
            except Exception as e:
                print("Notification/Socket error:", e)

            return Response(
                {"message": "Lesson uploaded successfully"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherLessonDetailView(APIView):

    permission_classes = [IsTeacher]

    def put(self, request, lesson_id):
        try:
            lesson = get_object_or_404(Lesson, id=lesson_id)

            title = request.data.get("title")
            duration = request.data.get("duration")
            description = request.data.get("description", "")
            video = request.FILES.get("video")

            if not title or not duration:
                return Response(
                    {"error": "Title and duration are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            lesson.title = title
            lesson.duration = duration
            lesson.description = description

            if video:
                old_key = lesson.video_key
                new_key = upload_video(video, lesson.course_id)
                lesson.video_key = new_key
                delete_video_from_s3(old_key)

            lesson.save()

            try:
                channel_layer = get_channel_layer()
                enrollments = Enrollment.objects.filter(course=lesson.course)

                for enrollment in enrollments:
                    student = enrollment.user
                    notification = Notification.objects.create(
                        user=student,
                        title="Lesson Updated",
                        message=f"Lesson '{lesson.title}' has been updated",
                        notification_type="general"
                    )

                    async_to_sync(channel_layer.group_send)(
                        f"user_{student.id}",
                        {
                            "type": "send_notification",
                            "notification": {
                                "id": notification.id,
                                "title": notification.title,
                                "message": notification.message,
                                "is_read": notification.is_read,
                                "created_at": str(notification.created_at),
                            }
                        }
                    )
            except Exception as n_err:
                print("Notification error:", n_err)

            return Response(
                {"message": "Lesson updated successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, lesson_id):
        try:
            lesson = get_object_or_404(Lesson, id=lesson_id)
            lesson.is_deleted = True
            lesson.save()

            return Response(
                {"message": "Lesson deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Public course list


class PublicCourseListView(APIView):

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            search = request.GET.get("search")
            category = request.GET.get("category")

            courses = Course.objects.filter(
                is_deleted=False,
                status="published",
                category__status="active"
            ).select_related("teacher", "category").prefetch_related("lessons").order_by("-created_at")

            if search:
                courses = courses.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search)
                )
            if category:
                courses = courses.filter(category_id=category)

            paginator = CoursePagination()
            page = paginator.paginate_queryset(courses, request)
            serializer = PublicCourseSerializer(
                page, many=True, context={"request": request})
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PublicCategoryListView(APIView):

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            categories = Category.objects.filter(
                is_deleted=False, status="active").order_by("name")
            serializer = PublicCategorySerializer(categories, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# course Detail page

class PublicCourseDetailView(APIView):

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            course = get_object_or_404(
                Course.objects.select_related("teacher", "category"),
                id=pk,
                status="published",
                category__status="active"
            )

            serializer = PublicCourseDetailSerializer(
                course,
                context={"request": request}
            )

            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentLessonVideoView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            try:
                lesson = Lesson.objects.get(id=lesson_id)
            except Lesson.DoesNotExist:
                return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

            signed_url = generate_signed_url(lesson.video_key)
            return Response({"signed_url": signed_url})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LessonCommentsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            comments = LessonComments.objects.filter(
                lesson_id=lesson_id,
                parent=None,
                is_deleted=False
            )

            serializer = LessonCommentSerializer(
                comments,
                many=True,
                context={"request": request}
            )

            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, lesson_id):
        try:
            LessonComments.objects.create(
                lesson_id=lesson_id,
                user=request.user,
                content=request.data.get("content")
            )
            return Response({"detail": "Comment added"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReplyCommentsView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        try:
            try:
                parent = LessonComments.objects.get(id=comment_id)
            except LessonComments.DoesNotExist:
                return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

            LessonComments.objects.create(
                lesson=parent.lesson,
                user=request.user,
                parent=parent,
                content=request.data.get("content")
            )

            return Response({"detail": "Reply added"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ToggleCommentLikeView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        try:
            try:
                comment = LessonComments.objects.get(id=comment_id)
            except LessonComments.DoesNotExist:
                return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

            like, created = CommentLike.objects.get_or_create(
                user=request.user,
                comment=comment
            )

            if not created:
                like.delete()

            return Response({
                "likes": comment.likes.count(),
                "liked": "created" if created else "deleted"
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteCommentView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            try:
                comment = LessonComments.objects.get(
                    id=comment_id, user=request.user)
            except LessonComments.DoesNotExist:
                return Response({"error": "Comment not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

            comment.is_deleted = True
            comment.save()

            return Response({"detail": "Deleted"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Course Review

class CourseReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            reviews = CourseReview.objects.filter(course_id=course_id)
            serializer = CourseReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, course_id):
        try:
            rating = request.data.get("rating")
            review = request.data.get("review")

            obj, created = CourseReview.objects.update_or_create(
                course_id=course_id,
                user=request.user,
                defaults={
                    "rating": rating,
                    "review": review
                }
            )
            return Response({"detail": "Review saved"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
