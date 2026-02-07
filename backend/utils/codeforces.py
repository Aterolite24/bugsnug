import requests
import time

BASE_URL = "https://codeforces.com/api"

def make_request(method, params=None):
    try:
        url = f"{BASE_URL}/{method}"
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        if data['status'] == 'OK':
            return data['result']
        else:
            raise Exception(f"Codeforces API Error: {data.get('comment', 'Unknown error')}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network Error: {str(e)}")

def get_user_info(handles):
    """
    Fetch user info for a list of handles.
    handles: list of strings or single string (semicolon separated)
    """
    if isinstance(handles, list):
        handles = ";".join(handles)
    return make_request("user.info", {"handles": handles})

def get_user_status(handle, from_index=1, count=1000):
    """
    Fetch submissions of user.
    """
    return make_request("user.status", {"handle": handle, "from": from_index, "count": count})

def get_contest_list(gym=False):
    """
    Fetch list of contests.
    """
    return make_request("contest.list", {"gym": gym})

def get_problems(tags=None):
    """
    Fetch problemset problems.
    """
    params = {}
    if tags:
        params["tags"] = ";".join(tags) if isinstance(tags, list) else tags
    return make_request("problemset.problems", params)
