from decimal import Decimal
from .models import *


def credit_admin_wallet(amount,description,course=None,source="course_fee"):

    wallet,_ = AdminWallet.objects.get_or_create(id=1)

    wallet.total_earnings += Decimal(amount)
    wallet.available_balance += Decimal(amount)
    wallet.save()

    AdminTransaction.objects.create(
        admin_wallet = wallet,
        course=course,
        source = source,
        description = description,
        amount = Decimal(amount),
        status = "transfer_pending"
    )