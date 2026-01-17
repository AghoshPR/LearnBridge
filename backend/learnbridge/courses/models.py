from django.db import models
from authapp.models import User
from cloudinary.models import CloudinaryField
# Create your models here.


class Category(models.Model):
    
    STATUS_CHOICES =[
        ('active','Active'),
        ('blocked','Blocked')
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_categories'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active'
    )

    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class Course(models.Model):

    

    LEVEL_CHOICES =(
        ('beginner','Beginner'),
        ('intermediate','Intermediate'),
        ('advanced','Advanced')
    )

    STATUS_CHOICES = (
        ('draft','Draft'),
        ('published','Published')
    )

    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role':'teacher'}        
        
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='courses'
    )

    title = models.CharField(max_length=250)
    description = models.TextField()
    level = models.CharField(max_length=20,choices=LEVEL_CHOICES)
    price = models.DecimalField(max_digits=10,decimal_places=2)

    thumbnail = CloudinaryField(
        "thumbnail",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    total_lessons = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# Lesson model


class Lesson(models.Model):

    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name="lessons")
    title = models.CharField(max_length=250)
    type = models.CharField(max_length=10,default='video')
    duration = models.CharField(max_length=20)
    video_key = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=["position"]
