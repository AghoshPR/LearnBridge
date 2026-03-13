from decimal import Decimal, ROUND_HALF_UP
from .models import *
from django.conf import settings
from liveclass.models import *


def credit_admin_wallet(amount, description, course=None, source="course_fee", razorpay_payment_id=None):
    try:
        wallet, _ = AdminWallet.objects.get_or_create(id=1)

        admin_share = (amount * Decimal("0.20")
                       ).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        teacher_share = (amount * Decimal("0.80")
                         ).quantize(Decimal("1"), rounding=ROUND_HALF_UP)

        wallet.total_earnings += Decimal(admin_share)
        wallet.available_balance += Decimal(amount)
        wallet.pending_balance += teacher_share
        wallet.save()

        AdminTransaction.objects.create(
            admin_wallet=wallet,
            course=course,
            source=source,
            description=description,
            amount=amount,
            status="transfer_pending"
        )

        # TEACHER WALLET PART
        teacher = course.teacher
        teacher_wallet, _ = TeacherWallet.objects.get_or_create(
            teacher=teacher)

        teacher_wallet.total_earnings += teacher_share
        teacher_wallet.pending_balance += teacher_share
        teacher_wallet.save()

        TeacherTransaction.objects.create(
            teacher_wallet=teacher_wallet,
            course=course,
            amount=teacher_share,
            description=description,
            status="payment_pending",
            transaction_id=razorpay_payment_id
        )
    except Exception as e:
        print(f"Error in credit_admin_wallet: {str(e)}")
        # Re-raise error to ensure view knows something went wrong
        raise e


def credit_live_class_wallet(live_class, amount, description, student, razorpay_payment_id=None):
    try:
        wallet, _ = AdminWallet.objects.get_or_create(id=1)

        admin_share = (amount * Decimal("0.20")).quantize(
            Decimal("1"), rounding=ROUND_HALF_UP
        )

        teacher_share = (amount * Decimal("0.80")).quantize(
            Decimal("1"), rounding=ROUND_HALF_UP
        )

        # ADMIN WALLET UPDATE
        wallet.total_earnings += admin_share
        wallet.available_balance += amount
        wallet.pending_balance += teacher_share
        wallet.save()

        AdminTransaction.objects.create(
            admin_wallet=wallet,
            live_class=live_class,
            course=None,
            source="live_class",
            description=description,
            amount=amount,
            status="transfer_pending"
        )

        # TEACHER WALLET UPDATE
        teacher_user = live_class.teacher.user

        teacher_wallet, _ = TeacherWallet.objects.get_or_create(
            teacher=teacher_user
        )

        teacher_wallet.total_earnings += teacher_share
        teacher_wallet.pending_balance += teacher_share
        teacher_wallet.save()

        TeacherTransaction.objects.create(
            teacher_wallet=teacher_wallet,
            live_class=live_class,
            student=student,
            course=None,
            source="live_class",
            amount=teacher_share,
            description=description,
            status="payment_pending",
            transaction_id=razorpay_payment_id
        )
    except Exception as e:
        print(f"Error in credit_live_class_wallet: {str(e)}")
        raise e
