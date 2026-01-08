from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication
from authapp.models import User
from rest_framework import status

# Create your views here.

class StudentProfile(APIView):

    authentication_classes=[CookieJWTAuthentication,CsrfExemptSessionAuthentication]

    permission_classes=[IsAuthenticated]


    def get(self,request):

        user=request.user

        return Response({
            "username":user.username,
            "email":user.email,
            "phone":user.phone,
            "address":user.address,
            "profile_image":user.profile_image
        })
    

    def patch(self,request):

        user = request.user
        user.phone = request.data.get("phone",user.phone)
        user.address = request.data.get("address",user.address)
        user.profile_image = user.profile_image

        user.save()

        return Response({"message":"Profile updated successfully"})