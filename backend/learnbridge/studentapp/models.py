from django.db import models
from authapp.models import User
from courses.models import *
# Create your models here.

class Wishlist(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="wishlists")
    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name="wishlisted")
    created_at  = models.DateTimeField(auto_now_add=True)


    class Meta:

        unique_together = ('user','course')


class Enrollment(models.Model):

    STATUS = (
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name="enrollments")
    progress = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS, default="in_progress")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "course")
