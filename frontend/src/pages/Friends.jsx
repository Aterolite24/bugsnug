import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await api.get('/users/friends/');
            setFriends(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch friends');
            setLoading(false);
        }
    };

    const handleAddFriend = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/users/friends/', { username });
            setSuccess('Friend added successfully');
            setUsername('');
            fetchFriends();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add friend');
        }
    };

    if (loading) return <div className="text-center text-white mt-10">Loading friends...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Friends</h1>

            {/* Add Friend */}
            <div className="bg-dark-card p-6 rounded-xl shadow border border-gray-700">
                <h3 className="text-xl font-bold text-dark-primary mb-4">Add Friend</h3>
                <form onSubmit={handleAddFriend} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        Add
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </div>

            {/* Friend List */}
            <div className="bg-dark-card rounded-xl shadow border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Your Friends</h3>
                {friends.length === 0 ? (
                    <p className="text-gray-400">No friends yet.</p>
                ) : (
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <div key={friend.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                                <div>
                                    <p className="font-bold text-dark-primary">{friend.username}</p>
                                    <p className="text-sm text-gray-400">{friend.codeforces_handle || 'No handle linked'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Follows you</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
