from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import *
from .models import *
from rest_framework.response import Response


# Create your views here.
class LiveClassMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        messages = LiveClassMessage.objects.filter(
            live_class_id=class_id
        ).select_related("user").order_by("created_at")

        data = [
            {
                "id": m.id,
                "user": m.user.username,
                "message": m.message,
                "created_at": m.created_at
            }
            for m in messages
        ]

        return Response(data)
