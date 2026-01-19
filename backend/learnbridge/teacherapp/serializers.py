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


class TeacherProfileSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="user.username",read_only=True)
    email=serializers.EmailField(source="user.email",read_only=True)
    profile_image = serializers.SerializerMethodField()
    resume = serializers.FileField(required=False, allow_null=True)
    

    class Meta:

        model = TeacherProfile
        fields=[
            "name",
            "email",
            "phone",
            "qualification",
            "subjects",
            "bio",
            "years_of_experience",
            "profile_image",
            "resume"
        ]

    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None
    
    
   