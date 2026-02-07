from django.db import models
from django.conf import settings

class Problem(models.Model):
    contest_id = models.IntegerField()
    index = models.CharField(max_length=5)
    name = models.CharField(max_length=255)
    rating = models.IntegerField(null=True, blank=True)
    tags = models.JSONField(default=list)
    
    class Meta:
        unique_together = ('contest_id', 'index')

    def __str__(self):
        return f"{self.contest_id}{self.index} - {self.name}"

class Submission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='submissions')
    submission_id = models.IntegerField(unique=True)
    verdict = models.CharField(max_length=50)
    creation_time_seconds = models.IntegerField()
    programming_language = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.submission_id} - {self.user.username}"

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    contest_id = models.IntegerField()
    index = models.CharField(max_length=5)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'contest_id', 'index')

    def __str__(self):
        return f"{self.user.username} - {self.contest_id}{self.index}"
