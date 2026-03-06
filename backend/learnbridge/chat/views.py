from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import *
from .models import *
from rest_framework.response import Response


# Create your views here.
class LiveClassMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        try:
            page = int(request.GET.get('page', 1))
            limit = 20
            start = (page - 1) * limit
            end = start + limit

            # Fetch latest messages first, then slice
            messages = LiveClassMessage.objects.filter(
                live_class_id=class_id
            ).select_related("user").order_by("-created_at")[start:end]

            data = [
                {
                    "id": m.id,
                    "user": m.user.username,
                    "message": m.message,
                    "created_at": m.created_at
                }
                for m in messages
            ]

            # Reverse so they are chronological in the frontend
            data.reverse()

            return Response({
                "messages": data,
                "has_more": len(data) == limit,
                "next_page": page + 1 if len(data) == limit else None
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

