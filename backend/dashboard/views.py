from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

# One app is allowed to import another app's models - that's how
# the dashboard can count slides and categories.
from categories.models import Category
from slides.models import Slide


# GET /api/dashboard/stats/
#
# Everything the Overview page needs, in ONE request. The page would
# otherwise have to make 4-5 separate calls every time it loads.
class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # --- The 4 number cards ---
        # .count() runs "SELECT COUNT(*)" - the database does the
        # counting, Python never loads the rows themselves.
        stats = {
            'total_users': User.objects.count(),
            'total_slides': Slide.objects.count(),
            'active_slides': Slide.objects.filter(is_active=True).count(),
            'total_categories': Category.objects.count(),
        }

        # --- The chart: how many people signed up on each of the last 7 days ---
        today = timezone.localdate()
        signups = []

        # range(6, -1, -1) counts 6, 5, 4, 3, 2, 1, 0 = "6 days ago"
        # up to "today". Oldest first, so the chart reads left to right.
        for days_ago in range(6, -1, -1):
            day = today - timedelta(days=days_ago)

            # The shape { label, value } is exactly what the React
            # BarChart component wants, so React doesn't need to
            # reshape anything.
            signups.append({
                'label': day.strftime('%b %d'),  # e.g. "Sep 24"
                # date_joined__date = "the date part of date_joined".
                'value': User.objects.filter(date_joined__date=day).count(),
            })

        # --- The two "recent" lists ---
        # '-date_joined' = newest first (the minus means "descending").
        # [:5] becomes SQL "LIMIT 5" - only 5 rows are fetched.
        recent_users = User.objects.order_by('-date_joined')[:5]

        # Slide has no "created" date, so the highest id = the newest.
        recent_slides = Slide.objects.order_by('-id')[:5]

        return Response({
            'stats': stats,
            'signups': signups,

            # [ ... for u in recent_users ] is a "list comprehension":
            # a short way to build a list with a loop. We pick only the
            # fields React needs - never send the whole user (password
            # hash, etc.) to the browser.
            'recent_users': [
                {'id': u.id, 'username': u.username, 'date_joined': u.date_joined}
                for u in recent_users
            ],
            'recent_slides': [
                {'id': s.id, 'title': s.title, 'order': s.order, 'is_active': s.is_active}
                for s in recent_slides
            ],
        })
