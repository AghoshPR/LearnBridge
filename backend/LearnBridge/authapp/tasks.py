from celery import shared_task
from .utils import (
    send_student_register_otp,
    send_teacher_register_otp,
    send_student_reset_otp,
    send_teacher_reset_otp,
)

@shared_task
def send_student_register_otp_task(email):
    print(f"[Celery] Sending Student Registration OTP to {email}")
    send_student_register_otp(email)

@shared_task
def send_teacher_register_otp_task(email):
    print(f"[Celery] Sending Teacher Registration OTP to {email}")
    send_teacher_register_otp(email)

@shared_task
def send_student_reset_otp_task(email):
    print(f"[Celery] Sending Student Password Reset OTP to {email}")
    send_student_reset_otp(email)

@shared_task
def send_teacher_reset_otp_task(email):
    print(f"[Celery] Sending Teacher Password Reset OTP to {email}")
    send_teacher_reset_otp(email)