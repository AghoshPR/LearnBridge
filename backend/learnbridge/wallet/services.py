from decimal import Decimal,ROUND_HALF_UP
from .models import *
from django.conf import settings







def credit_admin_wallet(amount,description,course=None,source="course_fee"):

    wallet,_ = AdminWallet.objects.get_or_create(id=1)


    admin_share = (amount * Decimal("0.20")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    teacher_share = (amount * Decimal("0.80")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)


    wallet.total_earnings += Decimal(admin_share)
    wallet.available_balance += Decimal(amount)
    wallet.pending_balance += teacher_share
    wallet.save()

    admin_tx = AdminTransaction.objects.create(
        admin_wallet = wallet,
        course=course,
        source = source,
        description = description,
        amount = amount,
        status = "transfer_pending"
    )

    # TEACHER WALLET PART

    teacher = course.teacher
    teacher_wallet , _ = TeacherWallet.objects.get_or_create(teacher=teacher)


    teacher_wallet.total_earnings += teacher_share
    teacher_wallet.pending_balance += teacher_share
    teacher_wallet.save()


    TeacherTransaction.objects.create(
        teacher_wallet = teacher_wallet,
        course = course,
        amount=teacher_share,
        description=description,
        status = "payment_pending"
    )