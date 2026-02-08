from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserView, VerifyHandleView, FriendListView, UserSubmissionsView, PublicUserView, UserSearchView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserView.as_view(), name='user_me'),
    path('verify-handle/', VerifyHandleView.as_view(), name='verify_handle'),
    path('friends/', FriendListView.as_view(), name='friend_list'),
    path('submissions/', UserSubmissionsView.as_view(), name='user_submissions'),
    path('public/<str:query>/', PublicUserView.as_view(), name='public-user'),
    path('search/', UserSearchView.as_view(), name='user-search'),
]
