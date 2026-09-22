from django.contrib import admin

from .models import Slide


# Gives us a web form at /admin to upload slide images and set
# their order, without writing any seed code.
admin.site.register(Slide)
