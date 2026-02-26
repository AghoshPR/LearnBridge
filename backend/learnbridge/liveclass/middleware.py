from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


class JWTAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        scope["user"] = AnonymousUser()

        headers = dict(scope["headers"])
        cookie_header = headers.get(b"cookie")

        if cookie_header:
            cookies = cookie_header.decode()
            cookie_dict = {}

            for item in cookies.split(";"):
                key, _, value = item.strip().partition("=")
                cookie_dict[key] = value

            token = cookie_dict.get("access_token")

            if token:
                try:
                    validated_token = AccessToken(token)
                    user = await self.get_user(validated_token["user_id"])
                    scope["user"] = user
                except Exception as e:
                    print("JWT ERROR:", e)

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()