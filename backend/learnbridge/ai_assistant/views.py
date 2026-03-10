from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import ask_gemini


class AskGeminiView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            question = request.data.get("question")

            if not question:
                return Response(
                    {"error": "Question is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            answer = ask_gemini(question)
            return Response({"answer": answer})

        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                return Response(
                    {"error": "AI Assistant is currently at its free-tier limit. Please try again in a few minutes."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            return Response(
                {"error": "An error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

