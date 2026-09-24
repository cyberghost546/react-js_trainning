from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Story, Like, Bookmark
from .serializers import StoryCardSerializer, StoryDetailSerializer, CommentSerializer


# GET /api/stories/
#
# Published stories, as cards. Filters come from the "query string"
# (the part after the ? in the URL), and are all optional:
#
#   /api/stories/                           every story, newest first
#   /api/stories/?category=paranormal       only that category
#   /api/stories/?sort=oldest               oldest first
#   /api/stories/?sort=popular              most views first
#   /api/stories/?limit=4                   only the first 4
#   /api/stories/?category=paranormal&sort=popular&limit=4   all at once
#
# One endpoint, many pages: a category page, a "latest stories" page,
# later an author page (?author=...) - just add another filter below.
class StoryListView(generics.ListAPIView):
    serializer_class = StoryCardSerializer

    # Instead of a fixed `queryset = ...`, get_queryset() runs on
    # EVERY request, so the query can depend on the URL.
    def get_queryset(self):
        stories = Story.objects.filter(is_published=True).select_related('author', 'category')

        # request.query_params is a dict of the ?key=value pairs.
        # .get() gives None if the key isn't in the URL.
        category = self.request.query_params.get('category')
        if category:
            # category__slug = "follow the ForeignKey to the category,
            # then compare its slug". Double underscore = go through
            # a relation.
            stories = stories.filter(category__slug=category)

        # The minus sign = descending (biggest / newest first).
        # Anything we don't recognise (or nothing at all) = newest.
        sort = self.request.query_params.get('sort')
        if sort == 'oldest':
            stories = stories.order_by('created_at')
        elif sort == 'popular':
            # Most views first. Two stories with the same views ->
            # the newer one goes first (the second sort key).
            stories = stories.order_by('-views', '-created_at')
        else:
            stories = stories.order_by('-created_at')

        # .isdigit() = "is it a whole number?" - so ?limit=abc is
        # simply ignored instead of crashing.
        # [:4] on a queryset becomes SQL "LIMIT 4". It has to come
        # LAST - you can't filter or sort after slicing.
        limit = self.request.query_params.get('limit')
        if limit and limit.isdigit():
            stories = stories[:int(limit)]

        return stories


# GET /api/stories/5/
#
# One whole story, for the story page. Drafts answer 404, exactly
# like a story that doesn't exist - so nobody can read a draft by
# guessing its number.
class StoryDetailView(generics.RetrieveAPIView):
    queryset = Story.objects.filter(is_published=True).select_related('author', 'category')
    serializer_class = StoryDetailSerializer

    # retrieve() is the method RetrieveAPIView runs for a GET. We take
    # over so we can count the view before answering.
    def retrieve(self, request, *args, **kwargs):
        # Finds the story from the <int:pk> in the URL, or answers 404.
        story = self.get_object()

        # +1 view. Two things worth knowing here:
        #
        # F('views') + 1 makes the DATABASE do the adding
        # ("SET views = views + 1"). If two people open the story at
        # the same moment, both views count. Doing it in Python
        # (story.views += 1; story.save()) could lose one.
        #
        # .update() instead of .save() also means updated_at does NOT
        # change - and the Story of the Day pick depends on updated_at,
        # so a busy story can't "steal" the pick just by being read.
        Story.objects.filter(pk=story.pk).update(views=F('views') + 1)

        # Re-read the new number so the page shows it.
        story.refresh_from_db(fields=['views'])

        return Response(self.get_serializer(story).data)


# ---------------------------------------------------------------
# LIKE / SAVE - both work exactly the same way, so the logic is
# written once in toggle() and both views call it.
# ---------------------------------------------------------------

def toggle(model, user, story):
    # get_or_create looks for the row, and creates it if it's missing.
    # It returns (the row, True/False "did I just create it?").
    row, created = model.objects.get_or_create(user=user, story=story)

    # It was already there -> this click means "undo".
    if not created:
        row.delete()

    # True = it's there now (liked / saved), False = it's gone.
    return created


# POST /api/stories/5/like/   ->  { "liked": true, "like_count": 12 }
# Click once to like, again to unlike.
class ToggleLikeView(APIView):
    # Logged-in users only. Logged out -> 403, and React sends them
    # to the Log In page instead.
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Like get_object(), but for an APIView: the story, or a 404.
        # Drafts count as "not found".
        story = get_object_or_404(Story, pk=pk, is_published=True)
        liked = toggle(Like, request.user, story)
        return Response({'liked': liked, 'like_count': story.likes.count()})


# POST /api/stories/5/save/   ->  { "saved": true }
class ToggleSaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk, is_published=True)
        saved = toggle(Bookmark, request.user, story)
        return Response({'saved': saved})


# GET  /api/stories/5/comments/  -> the comments, newest first (anyone)
# POST /api/stories/5/comments/  -> add one (logged in only)
class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    # "OrReadOnly" = anyone may READ (GET), only logged-in users may
    # WRITE (POST). Exactly what a comment section needs.
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_story(self):
        # self.kwargs holds the values from the URL - here the <int:pk>.
        return get_object_or_404(Story, pk=self.kwargs['pk'], is_published=True)

    def get_queryset(self):
        # story.comments = all comments pointing at this story (the
        # related_name). select_related('author') fetches the usernames
        # in the same query.
        return self.get_story().comments.select_related('author')

    # perform_create runs when a POST passed validation, right before
    # saving. We add the two things the visitor must NOT choose
    # themselves: who wrote it, and which story it's on.
    def perform_create(self, serializer):
        serializer.save(author=self.request.user, story=self.get_story())


# GET /api/stories/random/
#
# The id of one random published story: { "id": 7 }
# React then opens /stories/7. 404 if there are no stories at all.
class RandomStoryView(APIView):
    def get(self, request):
        # order_by('?') = "shuffle the rows". Fine for a small site;
        # on a table with millions of rows it gets slow, and you'd
        # pick a random id a smarter way.
        story = Story.objects.filter(is_published=True).order_by('?').first()

        if story is None:
            return Response({'detail': 'There are no stories yet.'}, status=404)

        return Response({'id': story.id})


# GET /api/stories/featured/
#
# The homepage picks. Public - anyone can read it.
# Answers:
#   { "story_of_the_day": {...} or null,
#     "story_of_the_week": {...} or null }
class FeaturedStoriesView(APIView):
    def get(self, request):
        # Never feature a draft.
        # select_related = fetch the author and category in the SAME
        # database query, instead of one extra query each later.
        published = Story.objects.filter(is_published=True).select_related('author', 'category')

        # order_by('-updated_at') = most recently edited first, so if
        # two stories are ticked, the one you ticked last wins.
        # .first() gives None when nothing matches (instead of crashing).
        day = published.filter(is_story_of_the_day=True).order_by('-updated_at').first()
        week = published.filter(is_story_of_the_week=True).order_by('-updated_at').first()

        return Response({
            'story_of_the_day': self.card(day, request),
            'story_of_the_week': self.card(week, request),
        })

    # Small helper so we don't write the same two lines twice.
    # Passing the request lets DRF turn the image path into a full
    # URL (http://localhost:8000/media/stories/...).
    def card(self, story, request):
        if story is None:
            return None
        return StoryCardSerializer(story, context={'request': request}).data
