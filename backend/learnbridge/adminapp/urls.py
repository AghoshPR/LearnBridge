from django.urls import path
from .views import *

urlpatterns = [
    
    path('teachers/pending/',PendingTeachersView.as_view()),
    path('teachers/approve/<int:id>/',ApproveTeacherView.as_view()),
    path('teachers/reject/<int:id>/',RejectTeacherView.as_view())
]
