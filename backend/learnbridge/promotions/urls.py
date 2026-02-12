from django.urls import path
from .views import *


urlpatterns = [

    path("offers/",AdminOfferListView.as_view()),
    path("offers/create/", AdminOfferCreateView.as_view()),
    path("offers/update/<int:pk>/", AdminOfferUpdateView.as_view()),
    path("offers/delete/<int:pk>/", AdminOfferDeleteView.as_view()),



]
