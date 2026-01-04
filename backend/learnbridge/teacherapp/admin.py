from django.contrib import admin
from .models import TeacherProfile


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "teacher_type",
        "qualification",
        "subjects",
        "status",
        "applied_at",
    )

    list_filter = ("teacher_type", "status")
    search_fields = ("user__email", "subjects")
    ordering = ("-applied_at",)
