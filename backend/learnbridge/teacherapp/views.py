from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import TeacherProfileSerializer
from .models import TeacherProfile


class SubmitTeacherProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):

        user=request.user

        if user.role != 'teacher':
            return Response(
                {'error':'Only teacher can submit profile'},status=403)
                
            
        
        if hasattr(user,'teacher_profile'):
            return Response(
                {'error':'Profile already submitted'},status=400)
        
        
        
        serializer = TeacherProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        return Response({
            "message":"Profile sumbitted successfully. Waiting for admin approval"
        })


