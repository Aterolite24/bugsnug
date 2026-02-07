from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Bugsnug API is running", "status": "OK"})

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/contests/', include('contests.urls')),
    path('api/problems/', include('problems.urls')),
]
