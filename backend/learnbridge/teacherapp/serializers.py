from rest_framework import serializers
from .models import TeacherProfile


class TeacherProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = TeacherProfile
        fields = [

            'teacher_type',
            'phone',
            'qualification',
            'subjects',
            'bio',
            'years_of_experience',
            'resume'
        ]

