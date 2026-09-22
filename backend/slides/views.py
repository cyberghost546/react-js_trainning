from rest_framework import generics

from .models import Slide
from .serializers import SlideSerializer


class SlideListView(generics.ListAPIView):
    # .filter(is_active=True) becomes "WHERE is_active = 1", so hidden
    # slides never reach the frontend. Ordering comes from the model's
    # Meta.ordering = ['order'].
    queryset = Slide.objects.filter(is_active=True)

    serializer_class = SlideSerializer
