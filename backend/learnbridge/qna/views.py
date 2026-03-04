from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from authapp.permissions import *
from rest_framework.permissions import *
from teacherapp.models import *
from django.db.models import *
from django.shortcuts import get_object_or_404


# admin tag view


class AdminTagListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        tags = Tag.objects.filter(is_active=True).order_by("-created_at")
        serializer = AdminTagSerializer(tags, many=True)
        return Response(serializer.data)


class AdminTagCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request):

        serializer = AdminTagSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save()
            return Response(
                {"message": "Tag created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminTagUpdateView(APIView):

    permission_classes = [IsAdmin]

    def patch(self, request, pk):

        try:

            tag = Tag.objects.get(pk=pk)

        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=404)

        serializer = AdminTagSerializer(tag, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Tag updated successfully"})
        return Response(serializer.errors, status=400)


class AdminTagDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self, request, pk):

        try:

            tag = Tag.objects.get(pk=pk, is_active=True)

        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=404)

        tag.is_active = False
        tag.save()

        return Response({"message": "Tag deleted successfully"})


# Question Listing

class QuestionListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        search = request.GET.get("search", "").strip()

        questions = Question.objects.filter(
            status="active"
        ).select_related(
            "user"
        ).prefetch_related(
            "tags"
        )

        if search:
            questions = questions.filter(
                Q(title__icontains=search) |
                Q(body__icontains=search) |
                Q(tags__tag_name__icontains=search)
            ).distinct()

        questions = questions.order_by("-created_at")

        serializer = QuestionListSerializer(questions, many=True)

        return Response(serializer.data)


# Question Create

class QuestionCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = QuestionCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer .save(user=request.user)
            return Response(

                {"message": "Question posted successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=400)


class QuestionDetailView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, pk):

        try:

            question = Question.objects.select_related(
                "user",
                "course"
            ).prefetch_related("tags").get(pk=pk)

        except Question.DoesNotExist:
            return Response({"error": "Not Found"}, status=404)
    
    

        # view counting

        if request.user.is_authenticated:
            obj, created = QuestionView.objects.get_or_create(
                user=request.user,
                question=question
            )

            if created:
                question.views_count += 1
                question.save()

        else:

            ip = request.META.get("REMOTE_ADDR")

            obj, created = QuestionView.objects.get_or_create(
                ip_address=ip,
                question=question
            )

            if created:
                question.views_count += 1
                question.save()

        serializer = QuestionDetailedSerializer(question)
        return Response(serializer.data)
    


class QuestionLikeToggleView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:

            question = Question.objects.get(pk=pk)

        except Question.DoesNotExist:

            return Response({"error": "Not found"}, status=404)

        like, created = QuestionLike.objects.get_or_create(
            user=request.user,
            question=question
        )

        if not created:
            like.delete()
            question.likes_count -= 1
            question.save()
            return Response({"message": "Unliked"})

        question.likes_count += 1
        question.save()
        return Response({"message": "Liked"})


class QuestionUpdateView(APIView):
    
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            question = Question.objects.get(pk=pk, user=request.user)
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found or unauthorized"},
                status=404
            )

        serializer = QuestionCreateSerializer(
            question,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)

class QuestionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            question = Question.objects.get(pk=pk, user=request.user)
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found or unauthorized"},
                status=404
            )

        question.delete()
        return Response({"message": "Question deleted successfully"}, status=200)


# answer views

class AnswerListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, pk):

        answers = Answer.objects.filter(question_id=pk).select_related(
            "user").prefetch_related("replies")
        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data)


class AnswerCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        serializer = AnswerCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user, question_id=pk)
            return Response({"message": "Answer posted successfully"})


class AnswerUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            answer = Answer.objects.get(pk=pk, user=request.user)
        except Answer.DoesNotExist:
            return Response({"error": "Answer not found or unauthorized"}, status=404)

        serializer = AnswerCreateSerializer(
            answer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Answer updated successfully"})
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            answer = Answer.objects.get(pk=pk, user=request.user)
        except Answer.DoesNotExist:
            return Response({"error": "Answer not found or unauthorized"}, status=404)

        answer.delete()
        return Response({"message": "Answer deleted successfully"})

# reply views


class ReplyCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        serializer = ReplyCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user, answer_id=pk)
            return Response(
                {"message": "Reply posted successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReplyUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            reply = Reply.objects.get(pk=pk, user=request.user)
        except Reply.DoesNotExist:
            return Response({"error": "Reply not found or unauthorized"}, status=404)

        serializer = ReplyCreateSerializer(
            reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Reply updated successfully"})
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            reply = Reply.objects.get(pk=pk, user=request.user)
        except Reply.DoesNotExist:
            return Response({"error": "Reply not found or unauthorized"}, status=404)

        reply.delete()
        return Response({"message": "Reply deleted successfully"})


class PublicTagListView(APIView):

    def get(self, request):

        tags = Tag.objects.filter(is_active=True)
        serializer = AdminTagSerializer(tags, many=True)
        return Response(serializer.data)


# Teacher QA side

class TeacherQuestionListView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        search = request.GET.get("search", "").strip()

        questions = Question.objects.filter(
            status="active",
            course__teacher=request.user
        ).select_related("user", "course").prefetch_related("tags")

        if search:
            questions = questions.filter(
                Q(title__icontains=search) |
                Q(body__icontains=search) |
                Q(tags__tag_name__icontains=search)
            ).distinct()

        questions = questions.order_by("-created_at")
        serializer = TeacherQuestionSerializer(questions, many=True)
        return Response(serializer.data)

class TeacherAnswerCreateView(APIView):
    permission_classes = [IsTeacher]

    def post(self, request, pk):
        try:
            question = Question.objects.get(pk=pk, course__teacher=request.user)
        except Question.DoesNotExist:
            return Response({"error": "Question not found or unauthorized"}, status=404)

        serializer = AnswerCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, question_id=pk)
            return Response({"message": "Answer posted successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminQuestionListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        status_filter = request.GET.get('status', 'all')
        if status_filter == 'reported':
            questions = Question.objects.filter(status='reported')
        else:
            questions = Question.objects.exclude(status='deleted')
            
        questions = questions.select_related('user').order_by('-created_at')
        
        data = []
        for q in questions:
            data.append({
                "id": q.id,
                "question": q.title,
                "author": q.user.username,
                "answers": q.answers.count() if hasattr(q, 'answers') else 0,
                "views": q.views_count,
                "status": q.status,
                "date": q.created_at.strftime("%Y-%m-%d"),
                "reports": 1 if q.status == 'reported' else 0,
                "reason": "Reported by community" if q.status == 'reported' else "",
            })
            
        return Response(data)

class AdminQuestionActionView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            q = Question.objects.get(pk=pk)
            q.status = 'deleted'
            q.save()
            return Response({"message": "Question deleted successfully"})
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=404)
            
    def post(self, request, pk):
        # Approve / Restore question
        try:
            q = Question.objects.get(pk=pk)
            q.status = 'active'
            q.save()
            return Response({"message": "Question approved"})
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=404)
