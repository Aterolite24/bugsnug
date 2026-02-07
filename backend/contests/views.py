from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from utils.codeforces import get_contest_list
import time

class ContestListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            # Fetch all contests
            contests = get_contest_list()
            # Filter upcoming contests
            current_time = int(time.time())
            upcoming = [c for c in contests if c['phase'] == 'BEFORE']
            # Sort by start time
            upcoming.sort(key=lambda x: x['startTimeSeconds'])
            return Response(upcoming)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
