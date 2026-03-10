from celery import shared_task
from .utils import send_otp

@shared_task
def send_otp_task(email):
    print(f"[Celery] Sending OTP to {email}")
    send_otp(email)