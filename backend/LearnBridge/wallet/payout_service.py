import razorpay
from django.conf import settings


client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


def create_contact(teacher):
    try:
        return client.contact.create({
            "name": getattr(teacher.teacher_profile, 'account_holder_name', teacher.username),
            "email": teacher.email,
            "contact": getattr(teacher.teacher_profile, 'phone', ''),
            "type": "vendor"
        })
    except Exception as e:
        print(f"Error creating Razorpay contact: {e}")
        raise e


def create_fund_account(contact_id, teacher):
    try:
        profile = teacher.teacher_profile
        return client.fund_account.create({
            "contact_id": contact_id,
            "account_type": "bank_account",
            "bank_account": {
                "name": profile.account_holder_name,
                "ifsc": profile.ifse_code,  # Fixed typo: was ifsc_code in code but ifse_code in model
                "account_number": profile.bank_account_number
            }
        })
    except Exception as e:
        print(f"Error creating Razorpay fund account: {e}")
        raise e


def create_payout(fund_account_id, amount):
    try:
        return client.payout.create({
            "account_number": "YOUR_RAZORPAY_ACCOUNT_NUMBER",
            "fund_account_id": fund_account_id,
            "amount": int(amount * 100),
            "currency": "INR",
            "mode": "IMPS",
            "purpose": "payout"
        })
    except Exception as e:
        print(f"Error creating Razorpay payout: {e}")
        raise e
