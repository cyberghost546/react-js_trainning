from django.conf import settings
from django.db import models

from categories.models import Category


class Story(models.Model):
    title = models.CharField(max_length=200)

    # The one-line teaser shown on cards under the title.
    excerpt = models.CharField(max_length=300, blank=True)

    body = models.TextField()

    # blank=True: a story without a picture is allowed - the card
    # shows a dark placeholder instead.
    cover_image = models.ImageField(upload_to='stories/', blank=True)

    # ForeignKey = "this story belongs to ONE category" (a link to a
    # row in another table).
    # on_delete=SET_NULL: if the category is deleted, keep the story
    # and just leave its category empty (that's why null=True).
    # related_name='stories' lets you go backwards: category.stories.all()
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stories',
    )

    # settings.AUTH_USER_MODEL instead of importing User directly -
    # Django's recommended way, so it still works if you ever swap in
    # a custom user model.
    # on_delete=CASCADE: delete the user -> their stories go too.
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='stories',
    )

    # Drafts stay hidden from the site until this is ticked.
    is_published = models.BooleanField(default=False)

    # The homepage picks. Tick these in the admin to choose the
    # Story of the Day / Week. If more than one is ticked, the most
    # recently edited one wins (see views.py).
    is_story_of_the_day = models.BooleanField(default=False)
    is_story_of_the_week = models.BooleanField(default=False)

    # How many times the story page was opened. Goes up by one in
    # StoryDetailView, and "Popular" sorts by it.
    # PositiveIntegerField = a whole number that can't go below 0.
    views = models.PositiveIntegerField(default=0)

    # auto_now_add = set once, when the row is created.
    # auto_now     = updated every time the row is saved.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Otherwise the admin would say "Storys".
        verbose_name_plural = 'stories'

    def __str__(self):
        return self.title

    # Normal Python methods on the model. The serializer can send their
    # results to React like any other field.
    def word_count(self):
        # .split() cuts the text at spaces -> a list of words.
        return len(self.body.split())

    def reading_time(self):
        # People read roughly 200 words a minute. max(1, ...) so a
        # very short story says "1 min read", not "0 min read".
        return max(1, round(self.word_count() / 200))


# ---------------------------------------------------------------
# LIKES AND SAVES
#
# Both are just "this user <-> this story" - a row exists, or it
# doesn't. Liking = create the row, unliking = delete it.
#
# unique_together: the database refuses a second row for the same
# user + story, so nobody can like the same story twice - even if
# they double-click, or call the API by hand.
# ---------------------------------------------------------------
class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes')
    # related_name='likes' is what makes story.likes.count() work.
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'story']

    def __str__(self):
        return f'{self.user} likes {self.story}'


# "Save" in the story's Actions menu - a bookmark to read later.
class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'story']

    def __str__(self):
        return f'{self.user} saved {self.story}'


class Comment(models.Model):
    # on_delete=CASCADE on both: delete the story (or the user) and
    # their comments go with it.
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')

    # max_length on a TextField isn't enforced by the database, but
    # the serializer (and the admin form) respect it.
    body = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Newest comments first.
        ordering = ['-created_at']

    def __str__(self):
        # The first 40 characters, so the admin list stays readable.
        return f'{self.author}: {self.body[:40]}'
