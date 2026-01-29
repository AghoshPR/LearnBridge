from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication
from authapp.models import User
from rest_framework import status
from .models import Wishlist
from .serializers import WishlistSerializer
from courses.models import Course

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
            "profile_image": user.profile_image.url if user.profile_image else None,
        })
    

    def patch(self,request):

        user = request.user
        user.phone = request.data.get("phone",user.phone)
        user.address = request.data.get("address",user.address)
        
        if "profile_image" in request.FILES:
            user.profile_image = request.FILES["profile_image"]

        user.save()

        return Response({
            "message": "Profile updated successfully",
            "profile_image": user.profile_image.url if user.profile_image else None
        }, status=status.HTTP_200_OK)
    


class WishlistListView(APIView):

    permission_classes=[IsAuthenticated]


    def get(self,request):

        items = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(items,many=True)
        return Response(serializer.data)
    

class WishlistAddView(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request):

        course_id = request.data.get("course_id")
        course = Course.objects.get(id=course_id)

        obj,created = Wishlist.objects.get_or_create(
            user=request.user,
            course=course
        )

        if not created:
            return Response({"detail":"Already in wishlist"},status=400)
        
        return Response({"detail":"Added to wishlist"},status=201)
    

class WishlistRemoveView(APIView):

    permission_classes=[IsAuthenticated]

    def delete(self,request,course_id):

        Wishlist.objects.filter(user=request.user,course_id=course_id).delete()
        return Response({"detail":"Removed from wishlist"},status=204)
    
