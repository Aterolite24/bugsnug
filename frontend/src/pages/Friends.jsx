import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { searchUsers } from '../services/api';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Friends = () => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);

    // Toggle State
    const [addMode, setAddMode] = useState('bugsnug'); // 'bugsnug' or 'codeforces'

    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true); // Friends loading
    const [searchLoading, setSearchLoading] = useState(false); // Search loading
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchFriends = async () => {
        try {
            const response = await api.get('/users/friends/');
            setFriends(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch friends');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const handleSearchUsers = async (query) => {
        setUsername(query);
        setError('');
        setSuccess('');
        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await searchUsers(query);
            setSearchResults(response.data);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAddUser = async (userToAdd) => {
        setError('');
        setSuccess('');
        try {
            await api.post('/users/friends/', { username: userToAdd });
            setSuccess(`Added ${userToAdd} to your network!`);
            setUsername('');
            setSearchResults([]);
            fetchFriends();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add friend');
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

    if (loading) return <div className="p-10 text-center animate-pulse text-salmon-pink">Loading friends...</div>;

    return (
        <div className="space-y-8 animate-float container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-eerie-black flex items-center gap-2">
                <span className="w-2 h-8 bg-salmon-pink rounded-full"></span>
                Friends & Rivals
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Friend Section */}
                <div className="bg-white p-8 rounded-[10px] border border-cultured shadow-card">
                    <h3 className="text-lg font-bold text-onyx mb-6 flex items-center gap-2">
                        <UserPlusIcon className="w-5 h-5 text-ocean-green" />
                        Add New Connection
                    </h3>

                    {/* Mode Toggle */}
                    <div className="flex bg-cultured p-1 rounded-lg mb-4">
                        <button
                            onClick={() => { setAddMode('bugsnug'); setSearchResults([]); setUsername(''); setError(''); setSuccess(''); }}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${addMode === 'bugsnug' ? 'bg-white text-salmon-pink shadow-sm' : 'text-sonic-silver hover:text-eerie-black'}`}
                        >
                            BugSnug User
                        </button>
                        <button
                            onClick={() => { setAddMode('codeforces'); setSearchResults([]); setUsername(''); setError(''); setSuccess(''); }}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${addMode === 'codeforces' ? 'bg-white text-ocean-green shadow-sm' : 'text-sonic-silver hover:text-eerie-black'}`}
                        >
                            CF Handle
                        </button>
                    </div>

                    {addMode === 'bugsnug' ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or username..."
                                    value={username}
                                    onChange={(e) => handleSearchUsers(e.target.value)}
                                    className="w-full bg-cultured border border-cultured px-5 py-3 rounded-[10px] pl-12 text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-salmon-pink/20 transition-all"
                                />
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sonic-silver" />
                            </div>

                            {/* Search Results */}
                            {searchLoading && <p className="text-sm text-sonic-silver text-center">Searching...</p>}
                            {username.length > 0 && searchResults.length === 0 && !loading && !searchLoading && (
                                <p className="text-sm text-sonic-silver text-center">No users found.</p>
                            )}

                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2">
                                {searchResults.map(user => (
                                    <div key={user.username} className="flex items-center justify-between p-2 hover:bg-cultured rounded-lg bg-white border border-transparent hover:border-cultured transition-colors">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-8 h-8 rounded-full bg-cultured flex-shrink-0">
                                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-eerie-black truncate">{user.username}</p>
                                                <p className="text-xs text-sonic-silver truncate">{user.firstName} {user.lastName}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddUser(user.username)}
                                            className="px-3 py-1 bg-salmon-pink/10 text-salmon-pink text-xs font-bold rounded hover:bg-salmon-pink hover:text-white transition-colors flex-shrink-0"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleAddFriend} className="flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Codeforces Handle"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-cultured border border-cultured px-5 py-3 rounded-[10px] pl-12 text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-ocean-green/20 transition-all"
                                    required
                                />
                                <CodeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sonic-silver" />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-ocean-green hover:bg-eerie-black text-white font-bold rounded-[10px] transition-all shadow-md"
                            >
                                Add Handle
                            </button>
                        </form>
                    )}
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-bittersweet mt-4 text-sm bg-bittersweet/10 p-3 rounded-[5px]">{error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ocean-green mt-4 text-sm bg-ocean-green/10 p-3 rounded-[5px]">{success}</motion.p>}
                </div>

                {/* Friend List */}
                <div className="bg-white p-8 rounded-[10px] border border-cultured shadow-card">
                    <h3 className="text-lg font-bold text-onyx mb-6 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-salmon-pink" />
                        Your Network
                    </h3>
                    {friends.length === 0 ? (
                        <div className="text-center py-10 text-sonic-silver border-2 border-dashed border-cultured rounded-[10px]">
                            No friends yet. Start adding people!
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {friends.map((friend, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={friend.username}
                                    onClick={() => navigate(`/profile/${friend.username || friend.codeforces_handle}`)}
                                    className="flex items-center justify-between p-4 rounded-[10px] bg-cultured hover:bg-white border border-transparent hover:border-cultured hover:shadow-sm transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-salmon-pink p-[2px]">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} alt={friend.username} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-eerie-black group-hover:text-salmon-pink transition-colors">{friend.username}</p>
                                            <p className="text-xs text-sonic-silver flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-ocean-green"></span>
                                                {friend.codeforces_handle || 'No handle'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/compare/${friend.codeforces_handle}`);
                                            }}
                                            className="text-sonic-silver hover:text-salmon-pink transition-colors p-2"
                                            title="Compare Stats"
                                        >
                                            <ChartBarIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/chat`);
                                            }}
                                            className="text-sonic-silver hover:text-ocean-green transition-colors p-2"
                                            title="Message"
                                        >
                                            <ChatBubbleIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Icons
const UserPlusIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CodeIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const ChatBubbleIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export default Friends;
