from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *


class NotificationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = Notification.objects.filter(
            user=request.user,
            is_deleted=False
        ).order_by("-created_at")

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        notification = Notification.objects.filter(
            id=pk,
            user=request.user
        ).first()

        if not notification:

            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response({"message": "Marked as read"})


class MarkAllNotificationsReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "All notifications marked as read"})


class DeleteNotificationView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        notification = Notification.objects.filter(
            id=pk,
            user=request.user
        ).first()

        if not notification:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_deleted = True
        notification.save()

        return Response({"message": "Notification deleted"})
