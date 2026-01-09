from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from datetime import datetime



# admin teacher teacher rejection with email

def send_teacher_rejection_email(email,name,reason):

    subject = "LearnBridge – Teacher Application Rejected"
    from_email=settings.DEFAULT_FROM_EMAIL
    to=[email]

    text_content = f"""

Hello {name},

We regret to inform you that your teacher application has been rejected.

Reason:
{reason}

You may update your profile and reapply again.

Regards,
LearnBridge Team
"""
    
    html_content = render_to_string(
        "emails/teacher_rejection.html",
        {
            "name":name,
            "reason":reason,
            "year":datetime.now().year
        }
    )

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        to
    )

    email_msg.attach_alternative(html_content,"text/html")
    email_msg.send()