from django.urls import path

from .views import DashboardStatsView


# Included under "api/" in config/urls.py, so this becomes
# /api/dashboard/stats/ (next to /api/dashboard/slides/ from the
# slides app).
urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view()),
]
