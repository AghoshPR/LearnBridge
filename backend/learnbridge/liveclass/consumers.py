import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *


class LiveClassConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.class_id = self.scope["url_route"]["kwargs"]["class_id"]
        self.room_group_name = f"liveclass_{self.class_id}"

        user = self.scope["user"]

        if not user.is_authenticated:
            await self.close()
            return

        is_allowed = await self.is_user_allowed(user)

        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept

    @database_sync_to_async
    def is_user_allowed(self, user):

        try:

            live_class = LiveClass.objects.get(class_id=self.class_id)

            # Teacher allowed
            if live_class.teacher.user == user:
                return True

            # Registered Student allowed

            return LiveClassRegistration.objects.filter(
                live_class=live_class,
                user=user
            ).exists()

        except LiveClass.DoesNotExist:
            return False

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):

        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "signal_message",
                "message": data
            }
        )

    async def signal_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))
