import random
from django.core.cache import cache
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from datetime import datetime


OTP_EXPIRY = 60  # 1 minutes


def _generate_and_store_otp(email):
    otp = str(random.randint(100000, 999999))
    cache.set(f"otp:{email}", otp, timeout=OTP_EXPIRY)
    return otp


def _send_email_base(email, otp, subject, title, message):
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [email]

    text_content = f"{title}\n\n{message.replace('<br>', ' ')}\n\nYour LearnBridge OTP is {otp}. It is valid for 1 minutes."

    html_content = render_to_string(
        "emails/otp_email.html",
        {
            "otp": otp,
            "title": title,
            "message": message,
            "year": datetime.now().year
        }
    )

    email_msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    email_msg.attach_alternative(html_content, "text/html")
    result = email_msg.send()
    print("Email send result:", result)


def send_student_register_otp(email):
    otp = _generate_and_store_otp(email)
    print("===================================")
    print(f"OTP for Student Registration ({email}) is: {otp}")
    print("===================================")

    subject = "LearnBridge Email Verification - Student Account"
    title = "Student Registration"
    message = "Welcome to LearnBridge! We're thrilled to have you join our learning community.<br>Please use the OTP below to complete your registration."
    _send_email_base(email, otp, subject, title, message)


def send_teacher_register_otp(email):
    otp = _generate_and_store_otp(email)
    print("===================================")
    print(f"OTP for Teacher Registration ({email}) is: {otp}")
    print("===================================")

    subject = "LearnBridge Email Verification - Teacher Account"
    title = "Teacher Registration"
    message = "Thank you for applying to be a teacher at LearnBridge! We are excited to see you share your expertise.<br>Please use the OTP below to verify your email address. Your profile will be reviewed by an admin after successful verification."
    _send_email_base(email, otp, subject, title, message)


def send_student_reset_otp(email):
    otp = _generate_and_store_otp(email)
    print("===================================")
    print(f"OTP for Student Password Reset ({email}) is: {otp}")
    print("===================================")

    subject = "LearnBridge - Student Password Reset Request"
    title = "Password Reset Request"
    message = "We received a request to reset the password for your student account at LearnBridge.<br>If you made this request, please use the OTP below to proceed. If you didn't request this, you can safely ignore this email."
    _send_email_base(email, otp, subject, title, message)


def send_teacher_reset_otp(email):
    otp = _generate_and_store_otp(email)
    print("===================================")
    print(f"OTP for Teacher Password Reset ({email}) is: {otp}")
    print("===================================")

    subject = "LearnBridge - Teacher Password Reset Request"
    title = "Password Reset Request"
    message = "We received a request to reset the password for your teacher account at LearnBridge.<br>Secure your teaching account by using the OTP below to reset your password. If you didn't request this, please ignore this email."
    _send_email_base(email, otp, subject, title, message)
