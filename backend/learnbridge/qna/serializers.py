from rest_framework import serializers
from .models import *


class AdminTagSerializer(serializers.ModelSerializer):

    class Meta:

        model = Tag
        fields = ['id', 'tag_name', 'slug', 'created_at']
        read_only_fields = ['slug', 'created_at']

    def valid_tag_name(self, value):

        if Tag.objects.filter(tag_name__iexact=value).exists():
            raise serializers.ValidationError("Tag already exists")

        return value


# Question creation

class QuestionCreateSerializer(serializers.ModelSerializer):

    tag_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True)

    class Meta:

        model = Question
        fields = ['course', 'title', 'body', 'tag_ids']

    def create(self, validated_data):

        tag_ids = validated_data.pop('tag_ids', [])
        question = Question.objects.create(**validated_data)

        if tag_ids:
            question.tags.set(tag_ids)

        return question


class QuestionListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    tags = AdminTagSerializer(many=True, read_only=True)
    answers_count = serializers.IntegerField(
        source="answers.count", read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "title",
            "body",
            "user_name",
            "created_at",
            "answers_count",
            "likes_count",
            "views_count",
            "tags"
        ]


class QuestionDetailedSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)
    tags = AdminTagSerializer(many=True, read_only=True)
    answers_count = serializers.IntegerField(
        source="answers.count", read_only=True)
    course_name = serializers.CharField(source="course.title", read_only=True)

    class Meta:

        model = Question
        fields = [
            "id",
            "title",
            "body",
            "user_name",
            "course_name",
            "created_at",
            "answers_count",
            "likes_count",
            "views_count",
            "tags"
        ]


class ReplySerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:

        model = Reply
        fields = [
            "id",
            "body",
            "user_name",
            "created_at"
        ]


class ReplyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reply
        fields = ["body"]


class AnswerSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:

        model = Answer
        fields = [
            "id",
            "body",
            "user_name",
            "created_at",
            "replies"
        ]


class AnswerCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ["body"]


# teacher side
