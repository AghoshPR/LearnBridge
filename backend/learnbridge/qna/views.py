from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from authapp.permissions import *
from rest_framework.permissions import *



# admin tag view


class AdminTagListView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):

        tags = Tag.objects.filter(is_active=True).order_by("-created_at")
        serializer  = AdminTagSerializer(tags,many=True)
        return Response(serializer.data)
    

class AdminTagCreateView(APIView):

    permission_classes=[IsAdmin]

    def post(self,request):

        serializer = AdminTagSerializer(data = request.data)
        if serializer.is_valid():

            serializer.save()
            return Response(
                {"message":"Tag created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class AdminTagUpdateView(APIView):

    permission_classes = [IsAdmin]

    def patch(self,request,pk):

        try:

            tag = Tag.objects.get(pk=pk)

        except Tag.DoesNotExist:
            return Response({"error":"Tag not found"},status=404)
        
        serializer = AdminTagSerializer(tag, data = request.data,partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Tag updated successfully"})
        return Response(serializer.errors,status=400)
    
class AdminTagDeleteView(APIView):

    permission_classes =[IsAdmin]


    def delete(self,request,pk):

        try:

            tag = Tag.objects.get(pk=pk,is_active=True)
        
        except Tag.DoesNotExist:
            return Response({"error":"Tag not found"},status=404)
        
        tag.is_active=False
        tag.save()

        return Response({"message":"Tag deleted successfully"})



# Question Listing

class QuestionListView(APIView):

    permission_classes=[AllowAny]

    def get(self,request):

        questions = Question.objects.filter(status="active").select_related("user").prefetch_related("tags").order_by("-created_at")

        serializer = QuestionListSerializer(questions,many=True)

        return Response(serializer.data)
    



# Question Create

class QuestionCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):

        serializer = QuestionCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer .save(user = request.user)
            return Response(

                {"message": "Question posted successfully"},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors,status=400)
    

class QuestionDetailView(APIView):

    permission_classes  = [AllowAny]

    def get(self,request,pk):

        try:

            question = Question.objects.select_related(
                "user",
                "course"
                ).prefetch_related("tags").get(pk=pk)

        except Question.DoesNotExist:
            return Response({"error":"Not Found"},status=404)
        
        serializer = QuestionDetailedSerializer(question)
        return Response(serializer.data)
    

# answer views
    
class AnswerListView(APIView):

    permission_classes=[AllowAny]


    def get(self,request,pk):

        answers = Answer.objects.filter(question_id=pk).select_related("user").prefetch_related("replies")
        serializer = AnswerSerializer(answers,many=True)
        return Response(serializer.data)

class AnswerCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request,pk):

        serializer = AnswerCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user = request.user,question_id=pk)
            return Response({"message":"Answer posted successfully"})

# reply views


class ReplyCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request,pk):

        serializer = ReplyCreateSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user,answer_id=pk)
            return Response(
                {"message": "Reply posted successfully"},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



class PublicTagListView(APIView):

    def get(self, request):

        tags = Tag.objects.filter(is_active=True)
        serializer = AdminTagSerializer(tags,many=True)
        return Response(serializer.data)

