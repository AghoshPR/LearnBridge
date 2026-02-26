import os
from django.core.asgi import get_asgi_application

# 🔴 THIS MUST COME FIRST
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LearnBridge.settings")

# Initialize Django ASGI application early
django_asgi_app = get_asgi_application()

# Now safe to import things that use Django models
from channels.routing import ProtocolTypeRouter, URLRouter
from liveclass.middleware import JWTAuthMiddleware
import liveclass.routing
import notifications.routing
import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(
        URLRouter(
            liveclass.routing.websocket_urlpatterns +
            notifications.routing.websocket_urlpatterns +
            chat.routing.websocket_urlpatterns
        )
    ),
})