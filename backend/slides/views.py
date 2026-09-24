from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import Slide
from .serializers import SlideSerializer, SlideDashboardSerializer


# ---------------------------------------------------------------
# PUBLIC - what the homepage slideshow reads. Anyone can GET it.
# ---------------------------------------------------------------
class SlideListView(generics.ListAPIView):
    # .filter(is_active=True) becomes "WHERE is_active = 1", so hidden
    # slides never reach the frontend. Ordering comes from the model's
    # Meta.ordering = ['order'].
    queryset = Slide.objects.filter(is_active=True)

    serializer_class = SlideSerializer


# ---------------------------------------------------------------
# DASHBOARD - only for admins (is_staff=True, like your superuser).
#
# IsAdminUser checks request.user.is_staff. The browser proves who
# you are with the "sessionid" cookie Django gives you when you log
# in (on the site's Log In page, or at /admin). No cookie = 403.
# ---------------------------------------------------------------

# GET  /api/dashboard/slides/  -> every slide, hidden ones too
# POST /api/dashboard/slides/  -> create a new slide
class SlideDashboardListView(generics.ListCreateAPIView):
    # .all() this time - the dashboard needs to see hidden slides too,
    # otherwise you could never turn one back on.
    queryset = Slide.objects.all()
    serializer_class = SlideDashboardSerializer
    permission_classes = [IsAdminUser]


# GET    /api/dashboard/slides/5/  -> one slide
# PATCH  /api/dashboard/slides/5/  -> change some fields of it
# DELETE /api/dashboard/slides/5/  -> remove it
class SlideDashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Slide.objects.all()
    serializer_class = SlideDashboardSerializer
    permission_classes = [IsAdminUser]
