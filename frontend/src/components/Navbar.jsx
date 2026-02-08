import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { searchUsers } from '../services/api';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    // Mock Notifications
    const notifications = [
        { id: 1, text: "System created: New Contest #192", time: "2m ago", read: false },
        { id: 2, text: "Alice sent you a friend request", time: "1h ago", read: false },
        { id: 3, text: "You solved 'Two Sums'!", time: "5h ago", read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = async (query) => {
        if (query.trim().length > 0) {
            try {
                const response = await searchUsers(query);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Search suggestion error", err);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/profile/${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    // ... (existing code)

    return (
        <header className="h-16 sticky top-0 z-30 flex items-center px-4 bg-white border-b border-cultured shadow-sm">
            {/* Mobile Toggle */}
            <button onClick={onOpenSidebar} className="lg:hidden p-2 text-sonic-silver hover:text-eerie-black mr-2">
                <MenuIcon />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-2 md:mx-4 relative z-50">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-sonic-silver group-focus-within:text-salmon-pink transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleInputChange(e.target.value);
                        }}
                        onKeyDown={handleSearch}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                        className="w-full bg-cultured border border-cultured text-eerie-black rounded-[10px] pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-salmon-pink/50 focus:border-transparent transition-all placeholder-sonic-silver"
                        placeholder="Search users or Codeforces handles..."
                    />

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-cultured shadow-xl rounded-[10px] overflow-hidden"
                            >
                                {suggestions.map(user => (
                                    <div
                                        key={user.username}
                                        onClick={() => {
                                            navigate(`/profile/${user.username}`);
                                            setShowSuggestions(false);
                                            setSearchQuery('');
                                        }}
                                        className="p-3 hover:bg-cultured cursor-pointer flex items-center gap-3 border-b border-cultured last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-cultured overflow-hidden">
                                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-eerie-black">{user.username}</p>
                                            <p className="text-xs text-sonic-silver">
                                                {user.firstName} {user.lastName} <span className="text-salmon-pink">•</span> {user.handle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2 text-sonic-silver hover:text-salmon-pink transition-colors rounded-lg hover:bg-cultured"
                    >
                        <BellIcon />
                        {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-bittersweet rounded-full animate-pulse"></span>}
                    </button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-80 bg-white border border-cultured shadow-xl rounded-[10px] z-50 overflow-hidden"
                            >
                                <div className="p-3 border-b border-cultured flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-onyx">Notifications</h3>
                                    <span className="text-xs text-salmon-pink cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`p-3 border-b border-cultured hover:bg-cultured/50 transition-colors ${!notif.read ? 'bg-salmon-pink/5' : ''}`}>
                                            <p className="text-sm text-eerie-black mb-1">{notif.text}</p>
                                            <p className="text-xs text-sonic-silver">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 pl-4 border-l border-cultured group focus:outline-none"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-eerie-black group-hover:text-salmon-pink transition-colors">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-sonic-silver">{user?.codeforces_handle || 'No Handle'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-cultured border border-cultured overflow-hidden ring-2 ring-transparent group-hover:ring-salmon-pink/50 transition-all">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 text-sonic-silver transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-white border border-cultured shadow-xl rounded-[10px] z-50 overflow-hidden"
                            >
                                <div className="p-2 space-y-1">
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-onyx hover:bg-cultured hover:text-salmon-pink rounded-[5px] transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Profile & Settings
                                    </Link>
                                    <div className="h-px bg-cultured my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-bittersweet hover:bg-bittersweet/10 rounded-[5px] transition-colors"
                                    >
                                        <LogoutIcon className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

// Icons
const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default Navbar;
