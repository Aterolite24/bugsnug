from rest_framework import serializers
from .models import Bookmark

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'contest_id', 'index', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']
