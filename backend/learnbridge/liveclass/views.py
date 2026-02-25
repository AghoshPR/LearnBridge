from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from teacherapp.models import TeacherProfile
from .models import *
from .serializers import LiveClassSerializer
from authapp.permissions import *
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from payments.utils import razorpay_client
import hmac
import hashlib
from wallet.services import credit_live_class_wallet

class TeacherLiveClassListView(APIView):

    permission_classes = [IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):


        teacher_profile = TeacherProfile.objects.get(user=request.user)
        classes = LiveClass.objects.filter(teacher=teacher_profile).order_by("-start_time")
        serializer = LiveClassSerializer(classes, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self,request):

        teacher_profile = TeacherProfile.objects.get(user=request.user)
        serializer = LiveClassSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():

            serializer.save(teacher=teacher_profile)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=400)
    

class TeacherLiveClassDetailView(APIView):

    permission_classes=[IsTeacher]
    parser_classes = [MultiPartParser, FormParser]


    def put(self,request,pk):

        teacher_profile = TeacherProfile.objects.get(user=request.user)

        try:

            live_class = LiveClass.objects.get(class_id=pk,teacher=teacher_profile)

        except LiveClass.DoesNotExist:

            return Response({"error":"Class not found"},status=404)
        
        serializer = LiveClassSerializer(live_class,data=request.data, context={'request': request})

        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors,status=400)
    

    def delete(self,request,pk):

        teacher_profile = TeacherProfile.objects.get(user=request.user)

        try:

            live_class = LiveClass.objects.get(class_id=pk,teacher=teacher_profile)
        
        except LiveClass.DoesNotExist:

            return Response({"error":"Class not found"},status=404)
        
        live_class.delete()
        return Response({"message":"Deleted Successfully"})
    


# student side


class StudentUpCommingLiveClassesView(APIView):

    def get(self,request):

        classes = LiveClass.objects.filter(
            status="scheduled",
            start_time__gte=timezone.now()
        ).order_by("start_time")

        serializer = LiveClassSerializer(classes,many=True, context={'request': request})
        return Response(serializer.data)
    



class JoinLiveClassView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request,class_id):

        try:

            live_class = LiveClass.objects.get(class_id=class_id)

            if live_class.teacher.user == request.user or \
               LiveClassRegistration.objects.filter(
                   live_class=live_class,
                   user=request.user
               ).exists():

                return Response({
                    "meeting_link":live_class.meeting_link
                })
            
            return Response({"error":"Not allowed"},status=403)

        except LiveClass.DoesNotExist:
            return Response({"error":"Not found"},status=404)


class CreateLiveClassRegistrationPayment(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):

        class_id = request.data.get("class_id")

        try:

            live_class = LiveClass.objects.get(class_id=class_id)
        
        except LiveClass.DoesNotExist:

            return Response({"error":"Class not found"},status=404)
        

        # Already Registered Checking

        if LiveClassRegistration.objects.filter(
            live_class = live_class,
            user = request.user
        ).exists():
            
            return Response({"error":"Already registered"},status=400)
        
        amount = live_class.registration_fee

        razorpay_order = razorpay_client.order.create({
            "amount":int(amount*100),
            "currency":"INR",
            "receipt": f"liveclass_{live_class.class_id}_{request.user.id}",
            "payment_capture": 1
        })


        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "key": settings.RAZORPAY_KEY_ID,
            "class_id": live_class.class_id
        })

class VerifyLiveClassPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):

        data = request.data

        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")
        class_id = data.get("class_id")


        # Verify Signature

        body = f"{razorpay_order_id}|{razorpay_payment_id}"
        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()

        if expected_signature != razorpay_signature:
            return Response({"error": "Invalid payment signature"}, status=400)
        
        live_class = LiveClass.objects.get(class_id=class_id)

        # create registration

        LiveClassRegistration.objects.get_or_create(
            live_class=live_class,
            user=request.user
        )

        # Credit wallet

        credit_live_class_wallet(
            live_class=live_class,
            amount=live_class.registration_fee,
            description=f"Live Class Registration - {live_class.title}",
            student=request.user

        )

        return Response({"detail": "Registration successful"})

