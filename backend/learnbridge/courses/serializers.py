from rest_framework import serializers
from .models import *
from django.db.models import Avg


class CategorySerializer(serializers.ModelSerializer):

    createdBy = serializers.CharField(source='created_by.role', read_only=True)

    courses = serializers.IntegerField(
        source = 'courses.count',
        read_only=True
    )

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'description',
            'status',
            'createdBy',
            'courses',
            'created_at'
        ]
    
    def validate_name(self,value):

        request = self.context['request']

        if Category.objects.filter(name__iexact=value,created_by=request.user).exists():
            raise serializers.ValidationError(
                "Category already exists"
            )
        return value


class CourseSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    total_lessons = serializers.SerializerMethodField()

    thumbnail_url = serializers.SerializerMethodField()

    instructor = serializers.CharField(
        source = 'teacher.username',
        read_only=True
    )

    students_count = serializers.SerializerMethodField()

    average_rating = serializers.SerializerMethodField()


    class Meta:

        model = Course
        fields = '__all__'
        read_only_fields = (
            'teacher',
            'total_lessons',
            'created_at',
            'updated_at'
        )

    def get_total_lessons(self, obj):
        return obj.lessons.count()
    

    def get_thumbnail_url(self,obj):

        if obj.thumbnail:
            return obj.thumbnail.url

        return None
    
    def get_students_count(self, obj):
        return obj.enrollments.count()
    
    def get_average_rating(self, obj):
        return round(
            obj.reviews.aggregate(avg=Avg("rating"))["avg"] or 0,
            1
        )
    

    

    def validate_category(self,category):

        request = self.context.get('request')

        if not request:
            raise serializers.ValidationError("Invalid request context.")
        
    


        if category.created_by != request.user:
            raise serializers.ValidationError(
                "You can only use your own categories."
            )
        

        if category.status != 'active':
            raise serializers.ValidationError(
                "Category is inactive."
            )
        
        return category
    

class LessonSerializer(serializers.ModelSerializer):

    class Meta:

        model = Lesson
        fields = [
            "id",
            "title",
            "duration",
            "description",
            "type",
            "position",
        ]


class PublicCourseSerializer(serializers.ModelSerializer):

    instructor = serializers.CharField(source="teacher.username",read_only=True)
    category = serializers.CharField(source="category.name",read_only=True)
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    thumbnail = serializers.SerializerMethodField()


    class Meta:

        model = Course
        fields=[

            "id",
            "title",
            "description",
            "level",
            "price",
            "instructor",
            "category",
            "category_id",
            "thumbnail",
            "total_lessons",
            "created_at",
        ]

    def get_thumbnail(self,obj):

        return obj.thumbnail.url if obj.thumbnail else None
    

class PublicCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class PublicCourseDetailSerializer(serializers.ModelSerializer):

    instructor = serializers.CharField(source="teacher.username",read_only=True)
    category = serializers.CharField(source = "category.name",read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:

        model = Course
        fields = [

            "id",
            "title",
            "description",
            "level",
            "price",
            "instructor",
            "category",
            "thumbnail",
            "total_lessons",
            "created_at",
        ]

    def get_thumbnail(self,obj):

        return obj.thumbnail.url if obj.thumbnail else None
    

class LessonCommentSerializer(serializers.ModelSerializer):
    
    user_name = serializers.CharField(source="user.username",read_only=True)
    replies = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked_by_me = serializers.SerializerMethodField()

    class Meta:

        model = LessonComments
        fields =[

            "id",
            "user_name",
            "content",
            "created_at",
            "replies",
            "likes_count",
            "is_liked_by_me"
        ]

    def get_replies(self,obj):

        qs = obj.replies.filter(is_deleted=False)
        return LessonCommentSerializer(qs,many=True,context=self.context).data
    

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked_by_me(self, obj):
        user = self.context["request"].user
        return obj.likes.filter(user=user).exists()
    


class CourseReviewSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username",read_only=True)
    
    
    class Meta:

        model = CourseReview
        fields = [
            "id",
            "user_name",
            "rating",
            "review",
            "created_at"
        ]