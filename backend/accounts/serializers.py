from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


# Checks the sign-up form and creates the user.
# We don't need our own User model - Django ships one (auth_user
# table) with username, email, password and is_staff already.
class SignUpSerializer(serializers.ModelSerializer):
    # write_only = accepted IN, never sent back OUT. Without this the
    # (hashed) password would come back in the response.
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

        # Django's User allows an empty email. We want one.
        extra_kwargs = {'email': {'required': True, 'allow_blank': False}}

    # validate_<fieldname> methods run automatically during is_valid().
    # Whatever you raise here shows up as {"email": ["..."]} in the
    # response, so React can put it under the right input.
    def validate_email(self, value):
        # iexact = case-insensitive, so Bob@x.com and bob@x.com clash.
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    # Runs the rules from AUTH_PASSWORD_VALIDATORS in settings.py:
    # at least 8 characters, not "password123", not all numbers.
    def validate_password(self, value):
        validate_password(value)
        return value

    # create_user, NOT User.objects.create(...). create_user hashes the
    # password. Plain create would store it as readable text, and
    # logging in would never work.
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
