from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User

    list_display = (
        "id",
        "username",
        "email",
        "role",
        "status",
        "is_active",
        "is_staff",
        "created_at",
    )

    list_filter = ("role", "status", "is_active", "is_staff")
    search_fields = ("username", "email")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {
            "fields": (
                "first_name",
                "last_name",
                "email",
                "phone",
                "address",
                "profile_image",
            )
        }),
        ("Permissions", {
            "fields": (
                "role",
                "status",
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important Dates", {
            "fields": ("last_login", "created_at", "updated_at")
        }),
    )

    readonly_fields = ("created_at", "updated_at")
