from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileView,
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserViewSet,
    LeaderboardView,
    UserPasswordChangeView,
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("auth/login/", UserLoginView.as_view(), name="api-login"),
    path("auth/logout/", UserLogoutView.as_view(), name="api-logout"),
    path("auth/register/", UserRegistrationView.as_view(), name="api-register"),
    path("auth/profile/", UserProfileView.as_view(), name="api-profile"),
    path(
        "auth/password/change/",
        UserPasswordChangeView.as_view(),
        name="api-password-change",
    ),
    path("leaderboard/", LeaderboardView.as_view(), name="api-leaderboard"),
    path("", include(router.urls)),
]
