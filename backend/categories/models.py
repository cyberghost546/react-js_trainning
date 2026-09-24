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
    
    # Longer text. blank=True lets the admin form leave it empty.
    # (blank is about forms; null is about the database. For text
    # fields Django's convention is an empty string, not NULL.)
    description = models.TextField(blank=True)

    # How the category's tile looks on the homepage.
    #
    # icon is a Lucide icon name (lucide.dev/icons), like 'ghost' or
    # 'skull'. React turns the name into the actual picture - see
    # frontend/src/components/CategoryGrid/categoryIcons.js. A name
    # React doesn't know yet just shows a book icon instead.
    icon = models.CharField(max_length=50, default='book-open')

    # choices = only these values are allowed, and the admin shows a
    # dropdown instead of a free text box. Each pair is
    # (value saved in the database, label shown in the admin).
    # Every colour here needs a matching entry in
    # frontend/src/styles/categoryColors.js.
    COLOR_CHOICES = [
        ('red', 'Red'),
        ('rose', 'Rose'),
        ('orange', 'Orange'),
        ('amber', 'Amber'),
        ('emerald', 'Emerald'),
        ('teal', 'Teal'),
        ('blue', 'Blue'),
        ('indigo', 'Indigo'),
        ('purple', 'Purple'),
        ('fuchsia', 'Fuchsia'),
    ]
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='red')


    # Note: we never declare "id". Django adds an auto-incrementing
    # primary key to every model automatically.

    # __str__ is Python's "how do I print this object?" method.
    # Django uses it in the admin - without it every row shows as
    # "Category object (1)" instead of its name.
    def __str__(self):
        return self.name
