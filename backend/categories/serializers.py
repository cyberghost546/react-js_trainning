# A serializer is the translator between Python objects and JSON.
# Model object -> JSON when sending a response, JSON -> model object
# when receiving one.
from rest_framework import serializers

# The "." means "this same folder" - a relative import.
from .models import Category


# ModelSerializer reads the model and works out the field types itself,
# so we don't have to describe each one by hand.
class CategorySerializer(serializers.ModelSerializer):
    # story_count is NOT a column in the table - the view calculates it
    # (see .annotate() in views.py). So we have to declare it here
    # ourselves; ModelSerializer can't find it on the model.
    story_count = serializers.IntegerField(read_only=True)

    # A nested "Meta" class is Django's convention for configuration
    # ABOUT a class, as opposed to its behaviour.
    class Meta:
        # Which model this serializer is built from.
        model = Category

        # A whitelist: only these fields get sent to the browser.
        # Never use '__all__' on a model with sensitive columns
        # (password hashes, tokens) or you will leak them.
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color', 'story_count']
