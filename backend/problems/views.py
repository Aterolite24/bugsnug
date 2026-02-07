from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from utils.codeforces import get_problems

class ProblemListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        tags = request.query_params.get('tags')
        if tags:
            tags = tags.split(',')
        
        try:
            # Fetch problems from CF
            data = get_problems(tags=tags)
            problems = data['problems']
            problem_stats = {f"{p['contestId']}{p['index']}": s for p, s in zip(data['problems'], data['problemStatistics'])}
            
            # Merge stats
            result = []
            for p in problems:
                key = f"{p['contestId']}{p['index']}"
                stats = problem_stats.get(key, {})
                p['solvedCount'] = stats.get('solvedCount', 0)
                result.append(p)

            # Pagination (simple)
            page = int(request.query_params.get('page', 1))
            page_size = 20
            start = (page - 1) * page_size
            end = start + page_size
            
            return Response({
                'count': len(result),
                'results': result[start:end]
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
