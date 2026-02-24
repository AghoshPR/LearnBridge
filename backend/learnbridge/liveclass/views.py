from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from teacherapp.models import TeacherProfile
from .models import LiveClass
from .serializers import LiveClassSerializer
from authapp.permissions import *
from rest_framework.parsers import MultiPartParser, FormParser


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
    


        

