

from django.urls import path
from .views import *


urlpatterns = [
    path("summary/", AdminWalletSummaryView.as_view()),
    path("transactions/", AdminWalletTransactionsView.as_view()),
    path("transfer/<int:transaction_id>/",AdminTransferToTeacherView.as_view())
    
]
