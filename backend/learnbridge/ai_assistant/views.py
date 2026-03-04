from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import ask_gemini


class AskGeminiView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        question = request.data.get("question")

        if not question:

            return Response(
                {"error": "Question is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            answer = ask_gemini(question)
            return Response({"answer": answer})

        except Exception as e:
            import traceback
            print("===== GEMINI ERROR TRACEBACK =====")
            traceback.print_exc()
            print("===================================")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

