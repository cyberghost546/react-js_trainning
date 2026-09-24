from django.urls import path

from .views import CategoryListView, CategoryDetailView


# Django looks for a variable named exactly "urlpatterns" in this file.
# Misspell it and there is no error - the routes just silently don't exist.
urlpatterns = [
    # This app's routes are included under "api/" in config/urls.py,
    # so the prefixes stack: "api/" + "categories/" = /api/categories/
    #
    # .as_view() turns the view class into something Django can call.
    # Easy to forget, and the resulting error is confusing.
    path('categories/', CategoryListView.as_view()),

    # <slug:slug> grabs "paranormal" out of /categories/paranormal/
    # and hands it to the view. The first "slug" is the TYPE (letters,
    # numbers, dashes), the second is the NAME the view receives.
    path('categories/<slug:slug>/', CategoryDetailView.as_view()),
]
