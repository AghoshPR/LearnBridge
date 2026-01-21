import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from datetime import datetime
from rest_framework.authentication import BaseAuthentication

OTP_EXPIRY = 60

def send_otp(email):

    otp = str(random.randint(100000,999999))


    # Store OTP in Redis (auto expires)
    cache.set(f"otp:{email}",otp,timeout=OTP_EXPIRY)

    print("===================================")
    print(f"OTP for {email} is: {otp}")
    print("===================================")

    subject = "LearnBridge Email Verification"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [email]

    text_content = f"Your LearnBridge OTP is {otp}. It is valid for 5 minutes."

    html_content = render_to_string(
        "emails/otp_email.html",
        {
            "otp": otp,
            "year": datetime.now().year
        }
    )

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        to
    )

    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()



class PublicAuthentication(BaseAuthentication):
    def authenticate(self, request):
        return None