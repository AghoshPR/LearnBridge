from django.db import models
from courses.models import *
from django.conf import settings
from liveclass.models import *
# admin wallet and admin Transactions

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
        ("live_class", "Live Class"),
        ("teacher_withdrawal", "Teacher Withdrawal"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [

        ("paid", "Paid by Student"),          
        ("transfer_pending", "Pending Transfer"),
        ("transferred", "Transferred to Teacher"),
        ("payout_processing", "Payout Processing"),
        ("payout_failed", "Payout Failed"), 
    ]

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    razorpay_payout_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    live_class = models.ForeignKey(
        LiveClass,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="admin_trasactions"
    )


    admin_wallet = models.ForeignKey(
        AdminWallet, on_delete=models.CASCADE, related_name="transactions"
    )
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


    # Teacher Wallet and Teacher Transactions


class TeacherWallet(models.Model):

    teacher = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_wallet"
    )

    total_earnings = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    available_balance = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    pending_balance = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    withdrawn_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)



    updated_at = models.DateField(auto_now=True)


    def __str__(self):
        return f"{self.teacher.username} Wallet"
    

class TeacherTransaction(models.Model):

    STATUS_CHOICES = [
        ("payment_pending", "Payment Pending"),
        ("payment_completed", "Payment Completed"),
    ]

    SOURCE_CHOICES = [
        ("course_sale", "Course Sale"),
        ("live_class", "Live Class"),
        ("withdrawal", "Withdrawal"),
    ]

    teacher_wallet = models.ForeignKey(
        TeacherWallet,
        on_delete=models.CASCADE,
        related_name="transactions",
        null=True,
        blank=True
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    source = models.CharField(   
        max_length=20,
        choices=SOURCE_CHOICES,
        default="course_sale"
    )

    transaction_id = models.CharField( 
        max_length=120,
        null=True,
        blank=True
    )

    live_class = models.ForeignKey(
        LiveClass,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teacher_transactions"
    )

    student = models.ForeignKey( 
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teacher_transactions"
    )

    amount = models.DecimalField(max_digits=10,decimal_places=2)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)


