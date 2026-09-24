from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignUpSerializer


# ---------------------------------------------------------------
# HOW LOGIN WORKS HERE
#
# Django's login() saves "user 3 is logged in" in the database and
# sends the browser a "sessionid" cookie pointing at it. The browser
# sends that cookie back with every request (React uses
# credentials: 'include'), and Django fills in request.user.
#
# It's the same cookie the /admin page uses - so logging in on the
# site also unlocks the slides dashboard for admins.
#
# These are plain APIViews instead of generics because they don't
# map to "list/create/update rows" - we write post()/get() ourselves.
# ---------------------------------------------------------------


# What React gets to know about a user. Kept in one function so
# every view sends the exact same shape.
def user_data(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
    }


# POST /api/accounts/signup/
class SignUpView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)

        # raise_exception=True: if anything is wrong, stop here and
        # answer 400 with the error messages. No if/else needed.
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Log them straight in - nobody wants to sign up and then
        # type the same password again.
        login(request, user)

        return Response(user_data(user), status=status.HTTP_201_CREATED)


# POST /api/accounts/login/
class LogInView(APIView):
    def post(self, request):
        # authenticate() checks the password against the hash.
        # Right password -> the User. Wrong -> None.
        user = authenticate(
            request,
            username=request.data.get('username'),
            password=request.data.get('password'),
        )

        # Same message for "no such user" and "wrong password" on
        # purpose - otherwise you tell attackers which usernames exist.
        if user is None:
            return Response(
                {'detail': 'Wrong username or password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        return Response(user_data(user))


# POST /api/accounts/logout/
class LogOutView(APIView):
    def post(self, request):
        # Deletes the session, so the old cookie stops working.
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


# GET /api/accounts/me/
# React calls this once when the page loads, to ask "is anyone
# already logged in?" (e.g. you logged in yesterday and the cookie
# is still there).
class MeView(APIView):
    # ensure_csrf_cookie = "always send the browser a csrftoken cookie
    # if it doesn't have one yet".
    #
    # Every POST from React (like, save, comment...) must carry that
    # token. Normally the browser gets it when logging in - but if the
    # cookie was cleared or expired while the login is still valid,
    # every button would fail. React calls /me/ on EVERY page load
    # (AuthContext), so this makes sure the token is always there.
    #
    # @method_decorator is needed because ensure_csrf_cookie was made
    # for plain functions, and get() is a method inside a class.
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        # Logged out is a normal answer, not an error - so no 403.
        # 204 = "No Content": nobody here. The frontend's authRequest
        # already turns a 204 into null, so React gets user = null.
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(user_data(request.user))
