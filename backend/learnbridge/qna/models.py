from django.db import models
from authapp.models import *
from courses.models import Course
from django.utils.text import slugify

class Tag(models.Model):

    tag_name = models.CharField(max_length=100,unique=100)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.tag_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tag_name


class Question(models.Model):

    STATUS_CHOICES = (
        ('active' , 'Active'),
        ('deleted', 'Deleted'),
        ('reported', 'Reported')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course,on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    body = models.TextField()
    tags = models.ManyToManyField(Tag,through="QuestionTag")
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class QuestionTag(models.Model):

    question = models.ForeignKey(Question,on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag,on_delete=models.CASCADE)

class Answer(models.Model):

    question = models.ForeignKey(Question,on_delete=models.CASCADE,related_name="answers")
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer to {self.question.title}"
    
class Reply(models.Model):


    answer = models.ForeignKey(Answer,on_delete=models.CASCADE,related_name="replies")
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply to Answer {self.answer.id}"