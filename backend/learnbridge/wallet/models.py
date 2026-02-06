from django.db import models
from courses.models import *

# Create your models here.

class AdminWallet(models.Model):

    total_earnings = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    available_balance = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    pending_balance = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    withdrawn_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    update_at = models.DateField(auto_now=True)

    def __str__(self):
        return "Admin Wallet"
    
class AdminTransaction(models.Model):

    SOURCE_CHOICES = [
        ("course_fee", "Course Fee"),
        ("teacher_withdrawal", "Teacher Withdrawal"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [

        ("paid", "Paid by Student"),          
        ("transfer_pending", "Pending Transfer"),
        ("transferred", "Transferred to Teacher"),
    ]

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


    admin_wallet = models.ForeignKey(
        AdminWallet, on_delete=models.CASCADE, related_name="transactions"
    )
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)