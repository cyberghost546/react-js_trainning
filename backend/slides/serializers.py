from rest_framework import serializers

from .models import Slide


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide

        # Note "image" here: DRF sends it as a relative path like
        # "/media/slides/case1.jpg". The React app runs on a different
        # port, so it has to prepend http://localhost:8000 to that.
        #
        # "is_active" is deliberately left out - the frontend never needs
        # it, the view already filters on it.
        fields = ['id', 'title', 'description', 'image', 'order']
