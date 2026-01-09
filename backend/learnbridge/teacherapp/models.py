from django.db import models
from authapp.models import User
from cloudinary.models import CloudinaryField
# Create your models here.


class TeacherProfile(models.Model):

    TEACHER_TYPE_CHOICES = [
        ('fresher','Fresher'),
        ('experienced','Experience')
    ]

    STATUS_CHOICES = [
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected')
    ]

    profile_image = CloudinaryField(
        "profile_image",
        blank=True,
        null=True
    )

    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='teacher_profile')

    teacher_type = models.CharField(max_length=20,choices=TEACHER_TYPE_CHOICES)

    phone=models.CharField(max_length=15)

    qualification = models.CharField(max_length=255,help_text="Highesh qualification of the teacher")
    subjects = models.CharField(max_length=255,help_text="Subjects teacher can teach")

    bio = models.TextField(help_text="Short introduction about the teacher")

    years_of_experience = models.PositiveIntegerField(null=True,blank=True,help_text="Required only if teacher is experienced")

    resume = models.FileField(upload_to='teacher_resumes/',null=True,blank=True)

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)


    def __str__(self):
        return f'{self.user.email}-{self.teacher_type}'

