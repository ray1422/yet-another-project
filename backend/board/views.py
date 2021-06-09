from rest_framework import viewsets, status
from rest_framework.response import Response

from board.models import Board
from board.serializers import BoardSerializer


class BoardViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    def list(self, request):
        queryset = Board.objects.all().order_by("-created_at", )[:3]
        serializer = BoardSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = BoardSerializer(data=request.data, context={'request': request}, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
