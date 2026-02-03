from django.contrib import admin
from .models import Course, Category, Lesson
# Register your models here.

@admin.register(Course)

class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "teacher",
        "category",
        "price",
        "level",
        "status",
        "created_at",
    )
    list_filter = ("status", "level", "category")
    search_fields = ("title", "description", "teacher__username")
    ordering = ("-created_at",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "position", "duration")
    ordering = ("course", "position")