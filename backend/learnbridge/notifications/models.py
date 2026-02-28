from django.db import models
from authapp.models import *
# Create your models here.


class Notification(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=50, choices=[
        ("payment", "Payment"),
        ("payout", "Payout"),
        ("reply", "Reply"),
        ("general", "General"),
    ],

        default="general")

    is_deleted = models.BooleanField(default=False)

    class Meta:

        ordering = ["-created_at"]
