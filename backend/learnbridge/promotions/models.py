from django.db import models
from courses.models import *
from django.core.validators import MinValueValidator,MaxLengthValidator



class Offer(models.Model):

    DISCOUNT_TYPE_CHOICES =[
        ("percentage","Percentage"),
        ("fixed","Fixed Amount"),
    ]

    APPLY_TYPE_CHOICES =[
        ("Course","Course"),
        ("Category","Category")
    ]

    title = models.CharField(max_length=255)

    discount_type = models.CharField(
        max_length=10,
        choices=DISCOUNT_TYPE_CHOICES
    )

    discount_value = models.DecimalField(
        max_digits=10,decimal_places=2
    )

    apply_type = models.CharField(
        max_length=20,
        choices=APPLY_TYPE_CHOICES
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    start_date = models.DateField()
    end_date = models.DateField()

    max_uses = models.PositiveIntegerField(default=0)
    used_count = models.PositiveIntegerField(default=0)

    is_active=models.BooleanField(True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title
    

    