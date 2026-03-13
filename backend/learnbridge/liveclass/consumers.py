import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import LiveClass, LiveClassRegistration

# WebSocket handler class


class LiveClassConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        try:
            self.class_id = self.scope["url_route"]["kwargs"]["class_id"]
            self.room_group_name = f"liveclass_{self.class_id}"
            self.user = self.scope["user"]

            print(
                f"[LiveClassConsumer] Connecting: User={self.user}, ClassID={self.class_id}")

            if not self.user.is_authenticated:
                print("[LiveClassConsumer] Rejecting: User not authenticated")
                await self.close()
                return

            is_allowed = await self.is_user_allowed()
            if not is_allowed:
                print(
                    f"[LiveClassConsumer] Rejecting: User {self.user.id} not allowed in class {self.class_id}")
                await self.close()
                return

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
            print(
                f"[LiveClassConsumer] Accepted: User {self.user.id} joined {self.room_group_name}")
        except Exception as e:
            print(f"[LiveClassConsumer] Connection Error: {e}")
            await self.close()

    @database_sync_to_async
    def is_user_allowed(self):
        try:
            live_class = LiveClass.objects.get(class_id=self.class_id)
            # Compare IDs to be safe
            if live_class.teacher.user_id == self.user.id:
                return True
            return LiveClassRegistration.objects.filter(
                live_class=live_class,
                user_id=self.user.id
            ).exists()
        except Exception as e:
            print(f"[LiveClassConsumer] Auth Check Error: {e}")
            return False

    async def disconnect(self, close_code):
        try:
            print(
                f"[LiveClassConsumer] Disconnecting: User={self.user.id if self.user.is_authenticated else 'Anon'} ({self.user.username if self.user.is_authenticated else 'Anon'}), Code={close_code}")

            # Notify others that this peer is leaving
            if hasattr(self, 'peer_id') and hasattr(self, 'room_group_name'):
                print(
                    f"[LiveClassConsumer] Broadcasting leave for peer: {self.peer_id}")
                try:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "signal_message",
                            "message": {
                                "type": "leave",
                                "from": self.peer_id,
                                "name": self.user.username
                            },
                            "sender_channel_name": self.channel_name
                        }
                    )
                except Exception as e:
                    print(f"[LiveClassConsumer] Leave broadcast error: {e}")

            if hasattr(self, 'room_group_name'):
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
        except Exception as e:
            print(f"[LiveClassConsumer] Disconnect Error: {e}")

    async def receive_json(self, content):
        try:
            msg_type = content.get("type")

            # Capture peer_id from any signaling message to ensure tracking
            if "from" in content:
                self.peer_id = content["from"]

            # Handle Chat Messages
            if "message" in content and not msg_type:
                message_text = content["message"]
                print(
                    f"[LiveClassConsumer] Chat received from {self.user.username}")
                await self.save_live_message(message_text)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": message_text,
                        "user": self.user.username,
                    }
                )
                return

            # Handle WebRTC Signals
            if msg_type in ["offer", "answer", "candidate", "join", "join_ack", "leave", "media-toggle"]:
                print(
                    f"[LiveClassConsumer] Signal: {msg_type} from {self.user.username} (peer: {getattr(self, 'peer_id', 'unknown')})")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "signal_message",
                        "message": content,
                        "sender_channel_name": self.channel_name
                    }
                )
        except Exception as e:
            print(f"[LiveClassConsumer] receive_json error: {e}")

    async def chat_message(self, event):
        await self.send_json({
            "user": event["user"],
            "message": event["message"],
            "type": "chat"
        })

    async def signal_message(self, event):
        if self.channel_name != event.get("sender_channel_name"):
            await self.send_json(event["message"])

    @database_sync_to_async
    def save_live_message(self, message):
        from chat.models import LiveClassMessage
        try:
            live_class = LiveClass.objects.get(class_id=self.class_id)
            LiveClassMessage.objects.create(
                live_class=live_class,
                user_id=self.user.id,
                message=message
            )
        except Exception as e:
            print(f"[LiveClassConsumer] Error saving message: {e}")
