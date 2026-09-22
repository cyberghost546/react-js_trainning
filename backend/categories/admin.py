from django.contrib import admin

from .models import Category


# Registering the model gives us a full web UI for it at /admin -
# list, add, edit, delete - without writing any of it ourselves.
# This is how we add categories by hand instead of writing seed code.
admin.site.register(Category)
