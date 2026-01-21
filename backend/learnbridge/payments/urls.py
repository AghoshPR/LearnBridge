

from django.urls import path
from .views import *


urlpatterns = [
   
    path("cart/", CartDetailView.as_view()),
    path("cart/add/", AddtoCartView.as_view()),
    path("cart/remove/<int:course_id>/", RemoveFromCartView.as_view()),
    path("cart/clear/", ClearCartView.as_view()),

]
