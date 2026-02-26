from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from liveclass.models import LiveClass, LiveClassRegistration
from teacherapp.models import TeacherProfile
from asgiref.sync import sync_to_async
from .models import *

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.class_id = self.scope["url_route"]["kwargs"]["class_id"]
        self.room_group_name = f"chat_{self.class_id}"
        self.user = self.scope["user"]

        print("USER:", self.scope["user"])
        print("AUTH:", self.scope["user"].is_authenticated)

        if not self.user.is_authenticated:
            await self.close()
            return

        is_allowed = await self.check_user_access()
        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    @database_sync_to_async
    def check_user_access(self):
        try:
            self.live_class = LiveClass.objects.get(class_id=self.class_id)
        except LiveClass.DoesNotExist:
            return False

        is_teacher = (self.live_class.teacher.user_id == self.user.id)
        is_registered = LiveClassRegistration.objects.filter(
            live_class_id=self.class_id,
            user_id=self.user.id
        ).exists()

        return is_teacher or is_registered

    async def receive(self, text_data):
        import json
        data = json.loads(text_data)
        message = data.get("message")

        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "user": self.user.username
            }
        )


    @sync_to_async
    def save_message(self, message):
        LiveClassMessage.objects.create(
            live_class=self.live_class,
            user=self.user,
            message=message
        )

    async def chat_message(self, event):
        await self.send_json({
            "message": event["message"],
            "user": event["user"]
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )