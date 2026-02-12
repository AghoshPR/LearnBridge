from rest_framework import serializers
from .models import *


class OfferSerializer(serializers.ModelSerializer):

    class Meta:
        model = Offer
        fields = "__all__"
        read_only_fields = ["is_deleted"]

    
    def validate(self, data):

        apply_type = data.get("apply_type")
        course = data.get("course")
        category = data.get("category")
        start_date = data.get("start_date")
        end_date = data.get("end_date")


        if apply_type  =="Course" and not course:

            raise serializers.ValidationError("Course is required.")
        
        if apply_type  == "Category" and not category:

            raise serializers.ValidationError("Category is required.")
        
        if start_date and end_date and start_date > end_date:

            raise serializers.ValidationError("End date must be after start date.")
        
        return data
    
        