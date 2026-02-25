from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json


class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.class_id = self.scope["url_route"]["kwargs"]["class_id"]
        self.room_group_name = f"chat_{self.class_id}"


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def recieve(self,text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type":"chat_message",
                "message":data["message"],
                "user":self.scope["user"].username
            }
        )
