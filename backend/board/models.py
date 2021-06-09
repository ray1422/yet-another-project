from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    author = models.CharField(max_length=32)
    ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=200)

    def __str__(self):
        return f"{self.author}: {self.content[:20]}"
