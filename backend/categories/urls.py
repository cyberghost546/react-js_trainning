from django.urls import path

from .views import CategoryListView


# Django looks for a variable named exactly "urlpatterns" in this file.
# Misspell it and there is no error - the routes just silently don't exist.
urlpatterns = [
    # This app's routes are included under "api/" in config/urls.py,
    # so the prefixes stack: "api/" + "categories/" = /api/categories/
    #
    # .as_view() turns the view class into something Django can call.
    # Easy to forget, and the resulting error is confusing.
    path('categories/', CategoryListView.as_view()),
]
