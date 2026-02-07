from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    codeforces_handle = models.CharField(max_length=50, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    # CF Stats
    rating = models.IntegerField(null=True, blank=True)
    rank = models.CharField(max_length=50, null=True, blank=True)
    max_rating = models.IntegerField(null=True, blank=True)
    max_rank = models.CharField(max_length=50, null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    avatar = models.URLField(null=True, blank=True)
    
    def __str__(self):
        return self.username

class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user} follows {self.to_user}"
