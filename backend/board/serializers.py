from django.contrib.auth.models import User
from rest_framework import serializers

from board.models import Board


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'ip', 'author', 'content', 'created_at']
        read_only_fields = ('ip', 'id', 'created_at')

    def create(self, validated_data):
        validated_data['ip'] = self.context.get('request').META.get("REMOTE_ADDR")
        return Board.objects.create(**validated_data)
