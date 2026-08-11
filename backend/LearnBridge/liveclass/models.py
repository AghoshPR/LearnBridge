from django.db import models

from django.conf import settings
from teacherapp.models import TeacherProfile
from courses.models import Course
from studentapp.models import User
from cloudinary.models import CloudinaryField


class LiveClass(models.Model):

    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )

    class_id = models.AutoField(primary_key=True)

    thumbnail = CloudinaryField(
        "image",
        folder="live_thumbnails",
        blank=True,
        null=True
    )

    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name="live_classes"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="live_classes"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    meeting_link = models.CharField(max_length=255)
    subject = models.CharField(max_length=255, blank=True, null=True)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    registration_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="scheduled"

    )

    duration_minutes = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.teacher.user.username}"


class LiveClassRegistration(models.Model):

    registration_id = models.AutoField(primary_key=True)

    live_class = models.ForeignKey(
        LiveClass,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="live_class_registrations"
    )

    registered_at = models.DateTimeField(auto_now_add=True)

    attended = models.BooleanField(default=False)

    class Meta:
        unique_together = ('live_class', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.live_class.title}"
