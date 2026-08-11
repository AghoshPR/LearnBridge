from .pagination import LiveClassPagination
from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from teacherapp.models import TeacherProfile
from .models import *
from django.db.models import Q
from .serializers import LiveClassSerializer
from authapp.permissions import *
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from payments.utils import razorpay_client
import hmac
import hashlib
from wallet.services import credit_live_class_wallet
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from notifications.models import *


class TeacherLiveClassListView(APIView):

    permission_classes = [IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):

        try:
            teacher_profile = TeacherProfile.objects.get(user=request.user)
        except TeacherProfile.DoesNotExist:
            return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)
        classes = LiveClass.objects.filter(
            teacher=teacher_profile).order_by("-start_time")
        serializer = LiveClassSerializer(
            classes, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        try:
            try:
                teacher_profile = TeacherProfile.objects.get(user=request.user)
            except TeacherProfile.DoesNotExist:
                return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = LiveClassSerializer(
                data=request.data, context={'request': request})

            if serializer.is_valid():
                live_class = serializer.save(teacher=teacher_profile)

                # Notifications
                try:
                    channel_layer = get_channel_layer()
                    students = User.objects.filter(role="student")

                    for student in students:
                        notification = Notification.objects.create(
                            user=student,
                            title="New Live Class Scheduled",
                            message=f"{live_class.title} scheduled on {live_class.start_time.strftime('%d %b %Y %I:%M %p')}",
                            notification_type="live_class"
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
                    print(f"[LiveClass] Notification error: {n_err}")

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherLiveClassDetailView(APIView):

    permission_classes = [IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            try:
                teacher_profile = TeacherProfile.objects.get(user=request.user)
            except TeacherProfile.DoesNotExist:
                return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                live_class = LiveClass.objects.get(
                    class_id=pk, teacher=teacher_profile)
            except LiveClass.DoesNotExist:
                return Response({"error": "Class not found"}, status=404)

            serializer = LiveClassSerializer(
                live_class, data=request.data, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            try:
                teacher_profile = TeacherProfile.objects.get(user=request.user)
            except TeacherProfile.DoesNotExist:
                return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                live_class = LiveClass.objects.get(
                    class_id=pk, teacher=teacher_profile)
            except LiveClass.DoesNotExist:
                return Response({"error": "Class not found"}, status=404)

            live_class.delete()
            return Response({"message": "Deleted Successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# student side


class StudentUpCommingLiveClassesView(APIView):

    def get(self, request):
        try:
            now = timezone.now()
            classes = LiveClass.objects.filter(
                status="scheduled",
                start_time__gt=now,
            ).order_by("start_time")

            paginator = LiveClassPagination()
            page = paginator.paginate_queryset(classes, request)
            serializer = LiveClassSerializer(
                page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentLiveNowClassesView(APIView):
    def get(self, request):
        try:
            now = timezone.now()

            
            query = Q(status="scheduled") & Q(
                start_time__lte=now) & Q(end_time__gte=now)

            
            if request.user.is_authenticated:
                query |= Q(status="scheduled") & Q(
                    registrations__user=request.user)

            classes = LiveClass.objects.filter(
                query).distinct().order_by("start_time")

            paginator = LiveClassPagination()
            page = paginator.paginate_queryset(classes, request)
            serializer = LiveClassSerializer(
                page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentPastLiveClassesView(APIView):
    def get(self, request):
        try:
            now = timezone.now()

            if request.user.is_authenticated:
                query = (Q(status="completed") | Q(status="cancelled") | Q(
                    end_time__lt=now)) & Q(registrations__user=request.user)
                classes = LiveClass.objects.filter(
                    query).distinct().order_by("-start_time")
            else:
                classes = LiveClass.objects.none()

            paginator = LiveClassPagination()
            page = paginator.paginate_queryset(classes, request)
            serializer = LiveClassSerializer(
                page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LiveClassRoomAccessView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        try:
            try:
                live_class = LiveClass.objects.get(class_id=class_id)
            except LiveClass.DoesNotExist:
                return Response({"error": "Class not found"}, status=404)

            # Teacher access
            if hasattr(request.user, "teacherprofile"):
                if live_class.teacher.user_id == request.user.id:
                    return Response({"allowed": True})

            # Student registration check
            is_registered = LiveClassRegistration.objects.filter(
                live_class_id=class_id,
                user_id=request.user.id
            ).exists()

            if is_registered:
                return Response({"allowed": True})

            return Response({"error": "Not allowed"}, status=403)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateLiveClassRegistrationPayment(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            class_id = request.data.get("class_id")

            try:
                live_class = LiveClass.objects.get(class_id=class_id)
            except LiveClass.DoesNotExist:
                return Response({"error": "Class not found"}, status=404)

            # Already Registered Checking
            if LiveClassRegistration.objects.filter(
                live_class=live_class,
                user=request.user
            ).exists():
                return Response({"error": "Already registered"}, status=400)

            amount = live_class.registration_fee

            razorpay_order = razorpay_client.order.create({
                "amount": int(amount*100),
                "currency": "INR",
                "receipt": f"liveclass_{live_class.class_id}_{request.user.id}",
                "payment_capture": 1
            })

            return Response({
                "razorpay_order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "key": settings.RAZORPAY_KEY_ID,
                "class_id": live_class.class_id
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyLiveClassPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data

            razorpay_order_id = data.get("razorpay_order_id")
            razorpay_payment_id = data.get("razorpay_payment_id")
            razorpay_signature = data.get("razorpay_signature")
            class_id = data.get("class_id")

            # Verify Signature
            body = f"{razorpay_order_id}|{razorpay_payment_id}"
            try:
                expected_signature = hmac.new(
                    settings.RAZORPAY_KEY_SECRET.encode(),
                    body.encode(),
                    hashlib.sha256
                ).hexdigest()

                if expected_signature != razorpay_signature:
                    return Response({"error": "Invalid payment signature"}, status=400)
            except Exception as sig_err:
                return Response({"error": f"Signature verification failed: {str(sig_err)}"}, status=400)

            try:
                live_class = LiveClass.objects.get(class_id=class_id)
            except LiveClass.DoesNotExist:
                return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)

            # create registration
            LiveClassRegistration.objects.get_or_create(
                live_class=live_class,
                user=request.user
            )

            # Credit wallet
            try:
                credit_live_class_wallet(
                    live_class=live_class,
                    amount=live_class.registration_fee,
                    description=f"Live Class Registration - {live_class.title}",
                    student=request.user,
                    razorpay_payment_id=razorpay_payment_id
                )
            except Exception as w_err:
                print(f"[LiveClass] Wallet credit error: {w_err}")

            return Response({"detail": "Registration successful"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
