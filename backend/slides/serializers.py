from rest_framework import serializers

from .models import Slide


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide

        # Note "image" here: DRF sends it as a full URL like
        # "http://localhost:8000/media/slides/case1.jpg" (it builds it
        # from the request). mediaUrl() in the frontend handles that.
        #
        # "is_active" is deliberately left out - the frontend never needs
        # it, the view already filters on it.
        fields = ['id', 'title', 'description', 'image', 'order']


# The dashboard needs one extra field the public slideshow doesn't:
# is_active, so you can hide a slide without deleting it.
# Everything else is the same, so we just extend the list.
class SlideDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ['id', 'title', 'description', 'image', 'order', 'is_active']
