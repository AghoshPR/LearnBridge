from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import TeacherProfileSerializer
from .models import TeacherProfile
from rest_framework import status
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication


class SubmitTeacherProfileView(APIView):

    authentication_classes = [
        CookieJWTAuthentication,
        CsrfExemptSessionAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    def post(self,request):

        user=request.user

        print("USER:", request.user)
        print("AUTH:", request.user.is_authenticated)

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


class TeacherProfileView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self,request):

        try:

            profile =request.user.teacher_profile
        
        except TeacherProfile.DoesNotExist:
            return Response(
                {"error":"Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = TeacherProfileSerializer(profile)

        return Response(serializer.data)
    

    def put(self,request):

        profile,created = TeacherProfile.objects.get_or_create(
            user=request.user
        )

        serializer = TeacherProfileSerializer(
            profile,
            data = request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message":"Profile updated successfully"},
            status=status.HTTP_200_OK
        )
