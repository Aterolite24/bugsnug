from django.urls import path
from . import views

urlpatterns = [
    path('history/<str:other_username>/', views.get_chat_history, name='chat-history'),
]
