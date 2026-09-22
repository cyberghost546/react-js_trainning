from django.urls import path

from .views import SlideListView


# Included under "api/" in config/urls.py, so this becomes /api/slides/
urlpatterns = [
    path('slides/', SlideListView.as_view()),
]
