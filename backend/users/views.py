from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Friendship
from .serializers import UserSerializer, RegisterSerializer
from utils.codeforces import get_user_info
from django.shortcuts import get_object_or_404

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class VerifyHandleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        handle = request.data.get('handle')
        if not handle:
            return Response({'error': 'Handle required'}, status=400)
        
        try:
            result = get_user_info(handle)
            if result:
                user = request.user
                user.codeforces_handle = handle
                user.save()
                return Response({'status': 'Handle valid', 'data': result[0]})
            else:
                return Response({'error': 'Handle not found'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class FriendListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        friendships = Friendship.objects.filter(from_user=request.user)
        friends = [f.to_user for f in friendships]
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data.get('username')
        if not username:
             return Response({'error': 'Username required'}, status=400)
        
        try:
            target_user = User.objects.get(username=username)
            if target_user == request.user:
                return Response({'error': 'Cannot add yourself'}, status=400)
            
            Friendship.objects.get_or_create(from_user=request.user, to_user=target_user)
            return Response({'status': 'Friend added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
