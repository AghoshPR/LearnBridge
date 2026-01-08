from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from teacherapp.models import TeacherProfile
from authapp.permissions import IsAdmin
from rest_framework import status
from authapp.models import User
from authapp.authentication import CookieJWTAuthentication, CsrfExemptSessionAuthentication
from .serializers import *
from rest_framework.response import Response


class PendingTeachersView(APIView):


    permission_classes = [IsAdmin]

    def get(self,request):

        profiles = TeacherProfile.objects.filter(status='pending')

        data = []

        for profile in profiles:

            data.append({

                "id":profile.id,
                "name":profile.user.username,
                "email":profile.user.email,
                "teacher_type": profile.teacher_type,
                "subjects": profile.subjects,
                "experience": profile.years_of_experience or "Fresher",
                "applied_at": profile.applied_at
            })

        return Response(data)



#----------admin approve and reject ----------#



class ApproveTeacherView(APIView):
    
    permission_classes = [IsAdmin]


    def get(self,request):

        profiles = TeacherProfile.objects.select_related("user").filter(status="approved")

        data = []

        for profile in profiles:

            data.append({

                "id":profile.id,
                "name":profile.user.username,
                'email':profile.user.email,
                "subjects":profile.subjects,
                "courses": 0,
                "students": 0,
                "rating": 5.0,
                "status":profile.user.status,
                "is_blocked": profile.user.status == "blocked"

            })
        return Response(data)


    def post(self,request,id):

        

        try:

            profile = TeacherProfile.objects.select_related('user').get(id=id)
        
        except TeacherProfile.DoesNotExist:

            return Response(
                {"error":"Teacher profile not found"},
                status=404
            )
        
        if profile.status != 'pending':

            return Response(
                {"error":"Teacher Already processed"},
                status=400
            )
        
        if not profile.user.is_active:
            return Response(
                {"error": "Teacher has not verified OTP"},
                status=400
            )
        




        profile.status = 'approved'
        profile.save()

        profile.user.status = 'active'
        profile.user.save()

        return Response({
            "message":"Teacher approved successfully"
        })
    






class RejectTeacherView(APIView):

    permission_classes=[IsAdmin]

    def post(self,request,id):
        

        try:

            profile = TeacherProfile.objects.select_related("user").get(id=id)
        except TeacherProfile.DoesNotExist:
            return Response(
                {"error":"Teacher profile not found"},
                status=404
            )


        # profile.status='rejected'
        user=profile.user
        user.delete()
        


        return Response({
            "message":"Teacher Rejected"
        })
    
class BlockTeacherView(APIView):

    permission_classes=[IsAdmin]

    def post(self,request,id):

        try:
            profile = TeacherProfile.objects.select_related("user").get(id=id)

        except TeacherProfile.DoesNotExist:

            return Response(
                {"error":"Teacher profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        profile.user.status="blocked"
        profile.user.save()

        return Response({
            "message":"Teacher Blocked Successfully"
        })
    
class UnBlockTeacherView(APIView):

    permission_classes=[IsAdmin]

    def post(self,request,id):

        try:

            profile = TeacherProfile.objects.select_related("user").get(id=id)

        except TeacherProfile.DoesNotExist:
            return Response(
                {"error":"Teacher profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        profile.user.status="active"
        profile.user.save()


        return Response({
            "message":"Teacher unblocked successfully"
        })


# AdminUsers

class AdminCreateUser(APIView):

    permission_classes=[IsAdmin]

    def post(self,request):

        serializer = AdminCreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()

        return Response(
            {
                "message":"User create successfully",
                "id":user.id,
                "username":user.username,
                "email":user.email,
                
            },status=status.HTTP_201_CREATED
        )



class AdminUsers(APIView):
    
    authentication_classes=[CsrfExemptSessionAuthentication,CookieJWTAuthentication]

    permission_classes=[IsAdmin]

    def get(self,request):

        
        
        users=User.objects.filter(role="student").order_by("-date_joined")
        serializer=AdminUserSerializer(users,many=True)
        return Response(serializer.data)
    

class BlockUser(APIView):

    authentication_classes=[CsrfExemptSessionAuthentication,CookieJWTAuthentication]
    permission_classes=[IsAdmin]

    def patch(self,request,user_id):

        
        
        try:

            user = User.objects.get(id=user_id,role="student")

        except User.DoesNotExist:
            return Response({"error":"Usernot found"},status=404)
        
        # if user.is_superuser:
        #     return Response(
        #         {"error": "Superuser cannot be blocked"},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
        if user.status =="blocked":
            return Response(
                {"error":"User already blocked"},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        user.is_active = False
        user.status="blocked"
        user.save()

        return Response({
            "message":"User blocked successfully",
            "id": user.id,
            "status": user.status

        },status=status.HTTP_200_OK)


class UnBlockUser(APIView):

    authentication_classes=[CsrfExemptSessionAuthentication,CookieJWTAuthentication]
    permission_classes=[IsAdmin]

    def patch(self,request,user_id):

        try:

            user=User.objects.get(id=user_id,role="student")

        except User.DoesNotExist:
            return Response(
                {"error":"User not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user.status != "blocked":

            return Response(
                {"error":"User is not blocked"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_active=True
        user.status="active"
        user.save()

        return Response({
            "message":"User Unblocked Successfully",
            "id":user.id,
            "status":user.status
        },status=status.HTTP_200_OK)
        


class DeleteUserView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role="student")
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


