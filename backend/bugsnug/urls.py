from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/contests/', include('contests.urls')),
    path('api/problems/', include('problems.urls')),
]
