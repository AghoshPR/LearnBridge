from django.db import models
from liveclass.models import *
from authapp.models import *
# Create your models here.

class LiveClassMessage(models.Model):
    live_class = models.ForeignKey(LiveClass,on_delete=models.CASCADE,related_name="messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]