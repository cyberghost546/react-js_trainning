from django.urls import path

from .views import SlideListView, SlideDashboardListView, SlideDashboardDetailView


# Included under "api/" in config/urls.py, so these become /api/...
urlpatterns = [
    path('slides/', SlideListView.as_view()),

    # <int:pk> grabs the number out of the URL (/dashboard/slides/5/)
    # and hands it to the view as "pk" (primary key = the slide's id).
    path('dashboard/slides/', SlideDashboardListView.as_view()),
    path('dashboard/slides/<int:pk>/', SlideDashboardDetailView.as_view()),
]
