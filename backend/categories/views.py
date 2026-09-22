# "generics" holds DRF's ready-made views for the common cases
# (list, create, retrieve, update, delete).
from rest_framework import generics

from .models import Category
from .serializers import CategorySerializer


# ListAPIView handles the whole GET request for us: runs the query,
# serializes the results, returns JSON. No request handling of our own.
class CategoryListView(generics.ListAPIView):
    # Which rows to return. This is the ORM - it becomes the SQL
    # "SELECT * FROM categories_category". "objects" is the manager
    # Django attaches to every model.
    queryset = Category.objects.all()

    # Which serializer converts those rows to JSON.
    serializer_class = CategorySerializer
