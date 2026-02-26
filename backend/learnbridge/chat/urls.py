from django.urls import path
from .views import LiveClassMessagesView

urlpatterns = [
    path(
        "student/liveclass/messages/<int:class_id>/",
        LiveClassMessagesView.as_view(),
        name="liveclass-messages"
    ),
]