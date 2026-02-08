from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Friendship
from .serializers import UserSerializer, RegisterSerializer
from utils.codeforces import get_user_info, get_user_status
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

from django.db.models import Q

class FriendListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        friendships = Friendship.objects.filter(from_user=request.user)
        friends = [f.to_user for f in friendships]
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data)

    def post(self, request):
        query = request.data.get('username')
        if not query:
             return Response({'error': 'Username or Handle required'}, status=400)
        
        try:
            target_user = User.objects.filter(Q(username=query) | Q(codeforces_handle__iexact=query)).first()
            if not target_user:
                return Response({'error': 'User not found'}, status=404)

            if target_user == request.user:
                return Response({'error': 'Cannot add yourself'}, status=400)
            
            Friendship.objects.get_or_create(from_user=request.user, to_user=target_user)
            return Response({'status': 'Friend added'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class UserSubmissionsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        handle = request.user.codeforces_handle
        if not handle:
            return Response({'error': 'Codeforces handle not linked'}, status=400)
        
        try:
            submissions = get_user_status(handle)
            return Response(submissions)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class PublicUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, query):
        user = User.objects.filter(Q(username=query) | Q(codeforces_handle__iexact=query)).first()
        if user:
            return Response({
                'username': user.username,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'codeforces_handle': user.codeforces_handle,
                'is_registered': True
            })
        return Response({'is_registered': False}, status=404)

class UserSearchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])

        users = User.objects.filter(
            Q(username__icontains=query) | 
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query)
        )[:10]  # Limit to 10 results
        
        results = [{
            'username': user.username,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'handle': user.codeforces_handle,
            'avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.username}"
        } for user in users]
        
        return Response(results)
