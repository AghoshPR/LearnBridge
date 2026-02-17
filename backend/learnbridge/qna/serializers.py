from rest_framework import serializers
from .models import *

class AdminTagSerializer(serializers.ModelSerializer):


    class Meta:

        model = Tag
        fields = ['id','tag_name','slug','created_at']
        read_only_fields = ['slug','created_at']


    def valid_tag_name(self,value):

        if Tag.objects.filter(tag_name__iexact=value).exists():
            raise serializers.ValidationError("Tag already exists")
        
        return value