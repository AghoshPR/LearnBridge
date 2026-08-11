

from django.urls import path
from .views import *


urlpatterns = [
    path("summary/", AdminWalletSummaryView.as_view()),
    path("transactions/", AdminWalletTransactionsView.as_view()),
    path("transfer/<int:transaction_id>/",
         AdminTransferToTeacherView.as_view()),
    path("summarydetails/", TeacherWalletSummaryView.as_view(),
         name="teacher-wallet-summary"),
    path("transactionsdetails/", TeacherWalletTrasactionsView.as_view(),
         name="teacher-wallet-transactions"),

]
