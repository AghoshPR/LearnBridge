import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            user = self.scope["user"]

            print("WS USER:", user)
            print("IS AUTH:", user.is_authenticated)

            if user.is_anonymous:
                await self.close()
            else:
                self.group_name = f"user_{user.id}"
                print("Joining group:", self.group_name)

                await self.channel_layer.group_add(
                    self.group_name,
                    self.channel_name
                )
                await self.accept()
        except Exception as e:
            print(f"[NotificationConsumer] Connect error: {e}")
            await self.close()
                

    async def disconnect(self, close_code):
        try:
            user = self.scope["user"]
            if not user.is_anonymous:
                await self.channel_layer.group_discard(
                    f"user_{user.id}",
                    self.channel_name
                )
        except Exception as e:
            print(f"[NotificationConsumer] Disconnect error: {e}")

    async def send_notification(self, event):
        try:
            await self.send(text_data=json.dumps({
                "notification": event["notification"]
            }))
        except Exception as e:
            print(f"[NotificationConsumer] Send error: {e}")
