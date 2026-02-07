from django.urls import path
from .views import ProblemListView, BookmarkView

urlpatterns = [
    path('', ProblemListView.as_view(), name='problem_list'),
    path('bookmark/', BookmarkView.as_view(), name='bookmark'),
]
