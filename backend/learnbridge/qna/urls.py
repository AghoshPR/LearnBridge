

from django.urls import path
from .views import *


urlpatterns = [
    path('tags/', AdminTagListView.as_view()),
    path('tags/create/', AdminTagCreateView.as_view()),
    path('tags/<int:pk>/update/', AdminTagUpdateView.as_view()),
    path('tags/<int:pk>/delete/', AdminTagDeleteView.as_view()),

    # questions

    path('public-tags/', PublicTagListView.as_view()),
    path('questions/', QuestionListView.as_view()),
    path('questions/create/', QuestionCreateView.as_view()),

    path('questions/editquestion/<int:pk>/', QuestionUpdateView.as_view()),
    path('questions/deletequestion/<int:pk>/', QuestionDeleteView.as_view()),
    path('questions/<int:pk>/', QuestionDetailView.as_view()),
    path('questions/<int:pk>/like/', QuestionLikeToggleView.as_view()),


    # public tags
    path('public-tags/', PublicTagListView.as_view()),

    # answers

    path('questions/answers/<int:pk>/', AnswerListView.as_view()),
    path('questions/answers/create/<int:pk>/', AnswerCreateView.as_view()),
    path('answers/<int:pk>/modify/', AnswerUpdateDeleteView.as_view()),

    # replies

    path('answers/reply/<int:pk>/', ReplyCreateView.as_view()),
    path('replies/<int:pk>/modify/', ReplyUpdateDeleteView.as_view()),

    # teacher qa

    path('teacher/questions/', TeacherQuestionListView.as_view()),
    path('teacher/answer/<int:pk>/', TeacherAnswerCreateView.as_view()),

    # admin qna
    path('admin/questions/', AdminQuestionListView.as_view()),
    path('admin/questions/<int:pk>/action/',
         AdminQuestionActionView.as_view()),
]
