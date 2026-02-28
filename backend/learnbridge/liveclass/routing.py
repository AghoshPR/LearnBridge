from django.urls import re_path
from .consumers import LiveClassConsumer

websocket_urlpatterns = [
    re_path(r"ws/liveclass/(?P<class_id>\d+)/$", LiveClassConsumer.as_asgi()),
]
