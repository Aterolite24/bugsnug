from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from django.db.models import Q

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, other_username):
    try:
        if request.method == 'GET':
            user = request.user
            other_user = User.objects.get(username=other_username)

            conversation = Conversation.objects.filter(participants=user).filter(participants=other_user).first()
            
            if conversation:
                messages = conversation.messages.all().order_by('timestamp')
                data = [{'sender': msg.sender.username, 'message': msg.text, 'timestamp': msg.timestamp} for msg in messages]
                return Response(data)
            else:
                return Response([])
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
