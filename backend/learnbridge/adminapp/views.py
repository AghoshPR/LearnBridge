from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from teacherapp.models import TeacherProfile
from authapp.permissions import IsAdmin


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


    def post(self,request,id):

        profile = TeacherProfile.objects.get(id=id)

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

        profile = TeacherProfile.objects.get(id=id)
        profile.status='rejected'
        profile.save()


        return Response({
            "message":"Teacher Rejected"
        })