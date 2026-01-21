from django.db import models
from django.conf import settings
from courses.models import *

User = settings.AUTH_USER_MODEL


class Cart(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user}"
    

class CartItem(models.Model):

    cart = models.ForeignKey(Cart,on_delete=models.CASCADE,related_name="items")
    course = models.ForeignKey(Course,on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("cart","course")

    def __str__(self):
        return f"{self.course.title}"
