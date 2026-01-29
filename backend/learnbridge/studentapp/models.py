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