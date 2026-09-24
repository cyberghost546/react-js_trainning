from django.urls import path

from .views import (
    StoryListView, StoryDetailView, FeaturedStoriesView, RandomStoryView,
    ToggleLikeView, ToggleSaveView, CommentListView,
)


# Included under "api/" in config/urls.py -> /api/stories/...
urlpatterns = [
    path('stories/', StoryListView.as_view()),
    path('stories/featured/', FeaturedStoriesView.as_view()),
    path('stories/random/', RandomStoryView.as_view()),

    # <int:pk> only matches numbers, so "featured" and "random" above
    # can never be mistaken for a story id. pk = "primary key" = the
    # story's id.
    path('stories/<int:pk>/', StoryDetailView.as_view()),
    path('stories/<int:pk>/like/', ToggleLikeView.as_view()),
    path('stories/<int:pk>/save/', ToggleSaveView.as_view()),
    path('stories/<int:pk>/comments/', CommentListView.as_view()),
]
