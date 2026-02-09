import razorpay
from django.conf import settings


client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def create_contact(teacher):

    return client.contact.create({
        "name":teacher.teacher_profile.account_holder_name,
        "email":teacher.email,
        "contact" : teacher.teacher_profile.phone,
        "type":"vendor"
    })

def create_fund_account(contact_id,teacher):

    return client.fund_account.create({
        "contact_id":contact_id,
        "account_type":"bank_account",
        "bank_account":{
            "name":teacher.teacher_profile.account_holder_name,
            "ifsc":teacher.teacher_profile.ifsc_code,
            "account_number":teacher.teacher_profile.bank_account_number
        }
    })

def create_payout(fund_account_id,amount):

    return client.payout.create({
        "account_number" : "YOUR_RAZORPAY_ACCOUNT_NUMBER",
        "fund_account_id" : fund_account_id,
        "amount" : int(amount * 100),
        "currency":"INR",
        "mode":"IMPS",
        "purpose":"payout"
    })