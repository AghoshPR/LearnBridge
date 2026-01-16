from rest_framework import serializers
from .models import Category,Course,Lesson


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

    thumbnail_url = serializers.SerializerMethodField()

    instructor = serializers.CharField(
        source = 'teacher.username',
        read_only=True
    )


    class Meta:

        model = Course
        fields = '__all__'
        read_only_fields = (
            'teacher',
            'total_lessons',
            'created_at',
            'updated_at'
        )

    def get_thumbnail_url(self,obj):

        if obj.thumbnail:
            return obj.thumbnail.url

        return None


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