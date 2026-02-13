from django.urls import path
from .views import *


urlpatterns = [

    path("offers/",AdminOfferListView.as_view()),
    path("offers/create/", AdminOfferCreateView.as_view()),
    path("offers/update/<int:pk>/", AdminOfferUpdateView.as_view()),
    path("offers/delete/<int:pk>/", AdminOfferDeleteView.as_view()),

    # admin coupons

    path("coupons/",AdminCouponListView.as_view()),
    path("coupons/create/",AdminCouponCreateView.as_view()),
    path("coupons/update/<int:pk>/",AdminCouponUpdateView.as_view()),
    path("coupons/delete/<int:pk>/",AdminCouponsDeleteView.as_view()),

    path("coupon/apply/",ApplyCouponView.as_view())

]
