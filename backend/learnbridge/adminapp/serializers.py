from rest_framework import serializers
from authapp.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from teacherapp.models import TeacherProfile


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "date_joined",
            "is_active",
        ]


class AdminCreateUserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)

    class Meta:

        model=User
        fields = ["username","email","password"]

    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_password(self, value):
            validate_password(value)
            return value

    
    def create(self, validated_data):
         
        user = User.objects.create_user(
             
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role="student",
            is_active=True,
            status="active"

        )
        return user
    

# Admin Teacher Creation

class AdminCreateTeacherSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    teacher_type = serializers.ChoiceField(choices=[
        ('fresher', 'Fresher'),
        ('experienced', 'Experienced')
    ])

    qualification = serializers.CharField()
    subjects = serializers.CharField()
    bio = serializers.CharField()

    years_of_experience = serializers.IntegerField(required=False)
    resume = serializers.FileField(required=False)

    def validate(self, data):
        if data["teacher_type"] == "experienced" and not data.get("years_of_experience"):
            raise serializers.ValidationError({
                "years_of_experience": "Required for experienced teachers"
            })
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role="teacher",
            is_active=True,
            status="active"
        )

        TeacherProfile.objects.create(
            user=user,
            teacher_type=validated_data["teacher_type"],
            qualification=validated_data["qualification"],
            subjects=validated_data["subjects"],
            bio=validated_data["bio"],
            years_of_experience=validated_data.get("years_of_experience"),
            resume=validated_data.get("resume"),
            status="approved"   
        )

        return user


    

