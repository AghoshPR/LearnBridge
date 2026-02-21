from rest_framework import serializers
from .models import *
from django.db.models import *
from .utils import *
from django.utils import timezone
from promotions.models import *
from decimal import Decimal


class CategorySerializer(serializers.ModelSerializer):

    createdBy = serializers.CharField(source='created_by.username', read_only=True)
    is_owner = serializers.SerializerMethodField()
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
            "status",
            "is_owner",
            'created_at'
        ]
    
    def validate_name(self,value):

        value = value.strip()

        qs = Category.objects.filter(
            name__iexact=value,
            is_deleted=False
            )

        
        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError("Category already exists")

        return value
    
    def get_is_owner(self, obj):
        request = self.context.get("request")
        if request:
            return obj.created_by == request.user
        return False
    
    


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

    def validate_title(self, value):
        request = self.context.get("request")

        qs = Course.objects.filter(
            title__iexact=value,
            teacher=request.user
        )

        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError("You already have a course with this title")

        return value
    

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
        
    


        
        

        if category.status != 'active':
            raise serializers.ValidationError(
                "Category is inactive."
            )
        
        return category
    

class LessonSerializer(serializers.ModelSerializer):

    video_url = serializers.SerializerMethodField()
    course_thumbnail = serializers.SerializerMethodField()

    class Meta:

        model = Lesson
        fields = [
            "id",
            "title",
            "duration",
            "description",
            "type",
            "position",
            "video_url",
            "course_thumbnail",
            
        ]

    def get_video_url(self, obj):
        return generate_signed_url(obj.video_key)
    
    def get_course_thumbnail(self, obj):
        if obj.course.thumbnail:
            return obj.course.thumbnail.url
        return None
    
    


class PublicCourseSerializer(serializers.ModelSerializer):

    instructor = serializers.CharField(source="teacher.username",read_only=True)
    category = serializers.CharField(source="category.name",read_only=True)
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    thumbnail = serializers.SerializerMethodField()

    students_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()

    final_price = serializers.SerializerMethodField()
    original_price = serializers.DecimalField(source="price",max_digits=10,decimal_places=2)
    has_offer = serializers.SerializerMethodField()

    
    


    class Meta:

        model = Course
        fields=[

            "id",
            "title",
            "description",
            "level",
            "price",
            "original_price",
            "final_price",
            "has_offer",
            "instructor",
            "category",
            "category_id",
            "thumbnail",
            "total_lessons",
            "created_at",
            "students_count",
            "average_rating",
            "total_duration",
            
    
        ]

    def get_thumbnail(self,obj):

        return obj.thumbnail.url if obj.thumbnail else None
    
    def get_total_lessons(self, obj):
        return obj.lessons.count()
    
    def get_students_count(self,obj):

        return obj.enrollments.count()
    
    def get_average_rating(self, obj):
        return round(
            obj.reviews.aggregate(avg=Avg("rating"))["avg"] or 0,
            1
        )
    
    def get_total_duration(self, obj):

        total_seconds = 0

        for lesson in obj.lessons.all():
            if not lesson.duration:
                continue

            parts = lesson.duration.split(":")
            parts = list(map(int, parts))

            if len(parts) == 2:
                total_seconds += parts[0] * 60 + parts[1]
            elif len(parts) == 3:
                total_seconds += parts[0] * 3600 + parts[1] * 60 + parts[2]

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60

        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
    
    def get_final_price(self,obj):

        now = timezone.now().date()

        offer = Offer.objects.filter(
            is_active = True,
            is_deleted=False,
            start_date__lte=now,
            end_date__gte=now
        ).filter(
            Q(course=obj) | Q(category=obj.category)
        ).first()

        if not offer:
            return obj.price
        
        if offer.discount_type=="percentage":
            discount = (obj.price * Decimal(offer.discount_value)/100)
            return obj.price - discount

        elif offer.discount_type == "fixed":
            return max(obj.price-Decimal(offer.discount_value),0)
        
        return obj.price
    
    def get_has_offer(self,obj):

        now = timezone.now().date()
        
        return Offer.objects.filter(
            is_active=True,
            is_deleted = False,
            start_date__lte=now,
            end_date__gte=now

        ).filter(
            Q(course=obj) | Q(category=obj.category)
        ).exists()
    

    
    

class PublicCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class PublicCourseDetailSerializer(serializers.ModelSerializer):

    instructor = serializers.CharField(source="teacher.username",read_only=True)
    category_id = serializers.IntegerField(source="category.id", read_only=True) 
    category = serializers.CharField(source = "category.name",read_only=True)
    thumbnail = serializers.SerializerMethodField()

    students_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField() 
    total_lessons = serializers.SerializerMethodField()

    final_price = serializers.SerializerMethodField()
    original_price = serializers.DecimalField(source="price",max_digits=10,decimal_places=2)
    has_offer = serializers.SerializerMethodField()

    is_enrolled = serializers.SerializerMethodField()

    class Meta:

        model = Course
        fields = [

            "id",
            "title",
            "description",
            "level",
            "price",
            "original_price",
            "final_price",
            "has_offer",
            "instructor",
            "category_id",
            "category",
            "thumbnail",
            "total_lessons",
            "created_at",
            "students_count",
            "average_rating",
            "reviews_count",
            "total_duration",
            "total_lessons",
            "is_enrolled"
        ]

    def get_thumbnail(self,obj):

        return obj.thumbnail.url if obj.thumbnail else None
    
    def get_students_count(self, obj):
        return obj.enrollments.count()

    def get_average_rating(self, obj):
        return round(
            obj.reviews.aggregate(avg=Avg("rating"))["avg"] or 0,
            1
        )

    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_total_duration(self, obj):

        total_seconds = 0

        for lesson in obj.lessons.all():
            if not lesson.duration:
                continue

            parts = lesson.duration.split(":")
            parts = list(map(int, parts))

            if len(parts) == 2:
                total_seconds += parts[0] * 60 + parts[1]
            elif len(parts) == 3:
                total_seconds += parts[0] * 3600 + parts[1] * 60 + parts[2]

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60

        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
    
    def get_total_lessons(self, obj):
        return obj.lessons.count()
    
    def get_final_price(self,obj):

        now = timezone.now().date()

        offer = Offer.objects.filter(
            is_active = True,
            is_deleted=False,
            start_date__lte=now,
            end_date__gte=now
        ).filter(
            Q(course=obj) | Q(category=obj.category)
        ).first()

        if not offer:
            return obj.price
        
        if offer.discount_type=="percentage":
            discount = (obj.price * Decimal(offer.discount_value)/100)
            return obj.price - discount

        elif offer.discount_type == "fixed":
            return max(obj.price-Decimal(offer.discount_value),0)
        
        return obj.price
    
    def get_has_offer(self,obj):

        now = timezone.now().date()
        
        return Offer.objects.filter(
            is_active=True,
            is_deleted = False,
            start_date__lte=now,
            end_date__gte=now

        ).filter(
            Q(course=obj) | Q(category=obj.category)
        ).exists()
    

    def get_is_enrolled(self,obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False
        

        from studentapp.models import Enrollment

        return Enrollment.objects.filter(
            user=request.user,
            course = obj
        ).exists()



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