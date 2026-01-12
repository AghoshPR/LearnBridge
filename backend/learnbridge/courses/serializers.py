from rest_framework import serializers
from .models import Category,Course


class CategorySerializer(serializers.ModelSerializer):

    createdBy = serializers.CharField(source='created_by.role', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'description',
            'status',
            'createdBy',
            'created_at'
        ]


class CourseSerializer(serializers.ModelSerializer):

    class Meta:

        model = Course
        fields = '__all__'
        read_only_fields = (
            'teacher',
            'status',
            'total_lessons',
            'created_at',
            'updated_at'
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