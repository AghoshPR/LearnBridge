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
    

class AdminTransferToTeacherView(APIView):

    permission_classes = [IsAdmin]

    def post(self,request,trasaction_id):

        admin_tx = AdminTransaction.objects.get(id=trasaction_id)

        if admin_tx.status != "transfer_pending":
            return Response({"error": "Already transferred"}, status=400)
        
        amount = admin_tx.amount
        teacher_share = (amount * Decimal("0.80")).quantize(Decimal("1"))

        # admin wallet update

        admin_wallet =  admin_tx.admin_wallet
        admin_wallet.available_balance -= teacher_share
        admin_wallet.withdrawn_amount += teacher_share
        admin_wallet.save()

        admin_tx.status="transferred"
        admin_tx.save()

        # Teacher wallet update

        teacher_wallet = TeacherWallet.objects.get(
            teacher = admin_tx.course.teacher
        )

        teacher_wallet.pending_balance -= teacher_share
        teacher_wallet.available_balance += teacher_share
        teacher_wallet.save()

        teacher_tx = TeacherTransaction.objects.filter(
            teacher_wallet = teacher_wallet,
            course = admin_tx.course,
            status = "payment_pending"

        ).first()


        if teacher_tx:

            teacher_tx.status = "payment_completed"
            teacher_tx.save()

        return Response({"message":"Transfer completed successfully"})


class TeacherWalletSummaryView(APIView):

    permission_classes = [IsTeacher]

    def get(self,request):

        wallet, _ = TeacherWallet.objects.get_or_create(
            teacher=request.user
        )

        return Response({
            "total_earnings": wallet.total_earnings,
            "available_balance": wallet.available_balance,
            "pending_balance": wallet.pending_balance,
            "withdrawn_amount" : wallet.withdrawn_amount
        })
    
class TeacherWalletTrasactionsView(APIView):

    permission_classes = [IsTeacher]

    def get(self,request):

        wallet,_ = TeacherWallet.objects.get_or_create(
            teacher = request.user
        )

        transactions = wallet.transactions.order_by("-created_at")

        data = []

        for t in transactions:

            data.append({
                "id":t.id,
                "date":t.created_at,
                "description":t.description,
                "amount":int(t.amount),
                "status":t.status,
            })
        
        return Response(data)