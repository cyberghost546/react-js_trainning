from django.urls import path

from .views import SignUpView, LogInView, LogOutView, MeView


# Included under "api/accounts/" in config/urls.py,
# so these become /api/accounts/signup/ and so on.
urlpatterns = [
    path('signup/', SignUpView.as_view()),
    path('login/', LogInView.as_view()),
    path('logout/', LogOutView.as_view()),
    path('me/', MeView.as_view()),
]
