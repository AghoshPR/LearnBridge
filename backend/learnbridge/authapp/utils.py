import random
from django.core.cache import cache
from django.core.mail import send_mail


OTP_EXPIRY = 60

def send_otp(email):

    otp = str(random.randint(100000,999999))


    # Store OTP in Redis (auto expires)
    cache.set(f"otp:{email}",otp,timeout=OTP_EXPIRY)

    send_mail(

        subject="LearnBridge Email Verification",
        message=f"Your OTP :{otp}",
        from_email="learnbridge@gmail.com",
        recipient_list=[email],
        fail_silently=False
    )