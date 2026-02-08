import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Conversation
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_username = text_data_json.get('sender', 'Anonymous')
        
        # Save message to database
        await self.save_message(sender_username, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_username
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

    @database_sync_to_async
    def save_message(self, username, message):
        user = User.objects.get(username=username)
        # Extract participants from room name (user1_user2)
        try:
            participants = self.room_name.split('_')
            other_username = participants[1] if participants[0] == username else participants[0]
            other_user = User.objects.get(username=other_username)
            
            # Find or create conversation
            conversation = Conversation.objects.filter(participants=user).filter(participants=other_user).first()
            if not conversation:
                conversation = Conversation.objects.create()
                conversation.participants.add(user, other_user)
                conversation.save()
            
            Message.objects.create(conversation=conversation, sender=user, text=message)
        except Exception as e:
            print(f"Error saving message: {e}")
