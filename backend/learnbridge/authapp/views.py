from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *

class StudentRegisterView(APIView):

    permission_classes=[AllowAny]

    def post(self,request):

        serializer = RegisterStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message":"Student registered successfully"})


class TeacherRegisterView(APIView):

    permission_classes=[AllowAny]


    def post(self,request):

        serializer=RegisterTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message":"Teacher registered,Waiting for approval"})

    
class LoginView(APIView):

    permission_classes=[AllowAny]

    def post(self,request):

        serializer=LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            "access":str(refresh.access_token),
            "refresh":str(refresh),
            "role":user.role,
            "username":user.username
        })

    

