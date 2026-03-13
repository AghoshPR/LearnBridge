from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from liveclass.models import LiveClass, LiveClassRegistration
from teacherapp.models import TeacherProfile
from asgiref.sync import sync_to_async
from .models import *


class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        try:
            self.class_id = self.scope["url_route"]["kwargs"]["class_id"]
            self.room_group_name = f"chat_{self.class_id}"
            self.user = self.scope["user"]

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
        except Exception as e:
            print(f"Error in ChatConsumer connect: {e}")
            await self.close()

    @database_sync_to_async
    def check_user_access(self):
        try:
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
        except Exception as e:
            print(f"Error in check_user_access: {e}")
            return False

    async def receive(self, text_data):
        try:
            import json
            data = json.loads(text_data)

            msg_type = data.get("type")

            # Handle WebRTC signaling
            if msg_type in ["offer", "answer", "candidate", "join"]:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "webrtc_signal",
                        "sender_channel_name": self.channel_name,
                        "data": data
                    }
                )
                return

            # Handle regular chat
            message = data.get("message")
            if message:
                await self.save_message(message)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": message,
                        "user": self.user.username
                    }
                )
        except Exception as e:
            print(f"Error in ChatConsumer receive: {e}")

    async def webrtc_signal(self, event):
        try:
            import json
            if self.channel_name != event["sender_channel_name"]:
                await self.send(text_data=json.dumps(event["data"]))
        except Exception as e:
            print(f"Error in webrtc_signal: {e}")

    @sync_to_async
    def save_message(self, message):
        try:
            LiveClassMessage.objects.create(
                live_class=self.live_class,
                user=self.user,
                message=message
            )
        except Exception as e:
            print(f"Error in save_message: {e}")

    async def chat_message(self, event):
        try:
            await self.send_json({
                "message": event["message"],
                "user": event["user"]
            })
        except Exception as e:
            print(f"Error in chat_message: {e}")

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"Error in disconnect: {e}")
