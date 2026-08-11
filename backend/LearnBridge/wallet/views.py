from authapp.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from decimal import Decimal, ROUND_HALF_UP
from django.db import transaction
from django.utils import timezone
from .payout_service import *
from authapp.permissions import *


class AdminWalletSummaryView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            wallet, _ = AdminWallet.objects.get_or_create(id=1)

            return Response({
                "total_earnings": wallet.total_earnings,
                "available_balance": wallet.available_balance,
                "pending_balance": wallet.pending_balance,
                "withdrawn_amount": wallet.withdrawn_amount
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminWalletTransactionsView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            wallet, _ = AdminWallet.objects.get_or_create(id=1)

            transactions = AdminTransaction.objects.select_related(
                "course", "course__teacher", "live_class", "live_class__teacher__user"
            ).filter(admin_wallet=wallet).order_by("-created_at")

            data = []

            for t in transactions:
                try:
                    full_amount = int(t.amount)

                    admin_share = int(
                        (t.amount * Decimal("0.20")
                         ).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
                    )

                    teacher_share = int(
                        (t.amount * Decimal("0.80")
                         ).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
                    )

                    if t.source == "course_fee" and t.course:
                        course_name = t.course.title
                        tutor_name = t.course.teacher.username   # 🔥 teacher is already User

                    elif t.source == "live_class" and t.live_class:
                        course_name = t.live_class.title
                        tutor_name = t.live_class.teacher.user.username  # 🔥 teacher is TeacherProfile

                    else:
                        course_name = None
                        tutor_name = None

                    data.append({
                        "id": t.id,
                        "date": t.created_at,
                        "courseName": course_name,
                        "tutorName": tutor_name,
                        "fullAmount": full_amount,
                        "adminShare": admin_share,
                        "teacherShare": teacher_share,
                        "source": t.source,
                        "status": t.status,
                        "description": t.description,
                    })
                except Exception as inner_e:
                    print(f"Error processing transaction {t.id}: {inner_e}")
                    continue

            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminTransferToTeacherView(APIView):

    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, transaction_id):
        try:
            try:
                admin_tx = AdminTransaction.objects.select_related(
                    "admin_wallet", "course__teacher", "live_class__teacher__user",
                ).get(id=transaction_id)
            except AdminTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

            if admin_tx.status != "transfer_pending":
                return Response({"error": "Already transferred"}, status=status.HTTP_400_BAD_REQUEST)

            if admin_tx.source == "course_fee":
                teacher = admin_tx.course.teacher
            elif admin_tx.source == "live_class":
                teacher = admin_tx.live_class.teacher.user
            else:
                return Response({"error": "Invalid transaction type"}, status=status.HTTP_400_BAD_REQUEST)

            amount = admin_tx.amount
            teacher_share = (amount * Decimal("0.80")).quantize(
                Decimal("1"), rounding=ROUND_HALF_UP
            )

            # ADMIN WALLET UPDATE
            admin_wallet = admin_tx.admin_wallet
            admin_wallet.available_balance -= teacher_share
            admin_wallet.pending_balance -= teacher_share
            admin_wallet.withdrawn_amount += teacher_share
            admin_wallet.save()

            admin_tx.status = "transferred"
            admin_tx.save()

            # TEACHER WALLET UPDATE
            teacher_wallet, _ = TeacherWallet.objects.get_or_create(
                teacher=teacher
            )

            teacher_wallet.pending_balance -= teacher_share
            teacher_wallet.available_balance += teacher_share
            teacher_wallet.save()

            if admin_tx.source == "course_fee":
                teacher_tx = TeacherTransaction.objects.filter(
                    teacher_wallet=teacher_wallet,
                    course=admin_tx.course,
                    status="payment_pending"
                ).first()
            elif admin_tx.source == "live_class":
                teacher_tx = TeacherTransaction.objects.filter(
                    teacher_wallet=teacher_wallet,
                    live_class=admin_tx.live_class,
                    status="payment_pending"
                ).first()
            else:
                teacher_tx = None

            if teacher_tx:
                teacher_tx.status = "payment_completed"
                if not teacher_tx.transaction_id:
                    teacher_tx.transaction_id = (
                        admin_tx.razorpay_payout_id
                        if admin_tx.razorpay_payout_id
                        else f"TRX-{admin_tx.id}-{int(timezone.now().timestamp())}"
                    )
                teacher_tx.save()

            return Response({
                "message": "Funds transferred to teacher wallet successfully"
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherWalletSummaryView(APIView):

    permission_classes = [IsTeacher]

    def get(self, request):
        try:
            wallet, _ = TeacherWallet.objects.get_or_create(
                teacher=request.user
            )

            live_class_total = wallet.transactions.filter(
                source="live_class"
            ).aggregate(
                total=models.Sum("amount")
            )["total"] or 0

            return Response({
                "total_earnings": wallet.total_earnings,
                "available_balance": wallet.available_balance,
                "pending_balance": wallet.pending_balance,
                "withdrawn_amount": wallet.withdrawn_amount,
                "live_class_revenue": live_class_total
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherWalletTrasactionsView(APIView):

    permission_classes = [IsTeacher]

    def get(self, request):
        try:
            wallet, _ = TeacherWallet.objects.get_or_create(
                teacher=request.user
            )

            transactions = wallet.transactions.order_by("-created_at")

            data = []

            for t in transactions:
                try:
                    if t.source == "course_sale" and t.course:
                        enrollment = t.course.enrollments.order_by(
                            "-id").first()
                        purchaser = enrollment.user.username if enrollment else None

                    elif t.source == "live_class" and t.live_class:
                        registration = t.live_class.registrations.order_by(
                            "-registration_id").first()
                        purchaser = registration.user.username if registration else None

                    else:
                        purchaser = None

                    data.append({
                        "id": t.id,
                        "date": t.created_at,
                        "transaction_id": t.transaction_id,
                        "description": t.description,
                        "amount": int(t.amount),
                        "status": t.status,
                        "source": t.source,
                        "purchaser": purchaser

                    })
                except Exception as inner_e:
                    print(
                        f"Error processing teacher transaction {t.id}: {inner_e}")
                    continue

            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
