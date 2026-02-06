from authapp.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from decimal import Decimal, ROUND_HALF_UP


class AdminWalletSummaryView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):

        wallet,_ = AdminWallet.objects.get_or_create(id=1)

        return Response({
            "total_earnings":wallet.total_earnings,
            "available_balance":wallet.available_balance,
            "pending_balance":wallet.pending_balance,
            "withdrawn_amount":wallet.withdrawn_amount
        })
    
class AdminWalletTransactionsView(APIView):

    def get(self,request):

        wallet,_ = AdminWallet.objects.get_or_create(id=1)

        transactions = AdminTransaction.objects.select_related(
            "course","course__teacher"
        ).filter(admin_wallet=wallet).order_by("-created_at")

        data=[]

        for t in transactions:

            full_amount = int(t.amount)

            admin_share = int(
                (t.amount * Decimal("0.20")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
            )

            teacher_share = int(
                (t.amount * Decimal("0.80")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
            )

            data.append({
                "id": t.id,
                "date": t.created_at,
                "courseName": t.course.title if t.course else None,
                "tutorName": t.course.teacher.username if t.course else None,
                "fullAmount": full_amount,
                "adminShare": admin_share,
                "teacherShare": teacher_share,
                "source": t.source,
                "status": t.status,
                "description": t.description,
            })


        return Response(data)