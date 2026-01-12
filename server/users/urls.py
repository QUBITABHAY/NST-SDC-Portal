from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileView, UserRegistrationView,
    UserViewSet, LeaderboardView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='api-register'),
    path('auth/profile/', UserProfileView.as_view(), name='api-profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='api-leaderboard'),
    path('', include(router.urls)),
]
