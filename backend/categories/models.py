from django.db import models


# Inheriting from models.Model is what makes this a database table.
# Django creates the table "categories_category" (app name + model name).
class Category(models.Model):
    # Each attribute becomes a column.
    # CharField = short text. max_length is required for this field type.
    name = models.CharField(max_length=100)

    # SlugField = URL-safe text (letters, numbers, hyphens): "True Crime" -> "true-crime"
    # unique=True makes the database itself reject duplicates, so two
    # categories can never share a URL.
    slug = models.SlugField(unique=True)

    # Note: we never declare "id". Django adds an auto-incrementing
    # primary key to every model automatically.

    # __str__ is Python's "how do I print this object?" method.
    # Django uses it in the admin - without it every row shows as
    # "Category object (1)" instead of its name.
    def __str__(self):
        return self.name
