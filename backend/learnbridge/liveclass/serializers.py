from rest_framework import serializers
from django.utils import timezone
from .models import *



class LiveClassSerializer(serializers.ModelSerializer):


    registered_count = serializers.SerializerMethodField()
    course_name = serializers.CharField(source="course.title",read_only=True)
    teacher_name = serializers.CharField(source="teacher.user.username", read_only=True)
    thumbnail = serializers.ImageField(required=False)


    class Meta:

        model = LiveClass
        fields = "__all__"
        read_only_fields = ("teacher","created_at")


    def get_registered_count(self, obj):
        return obj.registrations.count()
    
    

    def validate(self, data):
        start = data.get("start_time")
        end = data.get("end_time")

        
        if start and end:
            if start >= end:
                raise serializers.ValidationError("End time must be after start time.")

        if start < timezone.now():
            raise serializers.ValidationError("Cannot schedule class in the past.")


        return data

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value
    
    


    