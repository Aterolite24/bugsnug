import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCFUser, getPublicUser, getCFSubmissions } from '../services/api';
import Heatmap from '../components/Heatmap';
import StatCard from '../components/StatCard';
import { Zap, Flame, BarChart2, UserPlus, MessageSquare, Info, CheckCircle } from "lucide-react";
import { RatingChart, ProblemDistributionChart } from '../components/Charts';
import { LanguageChart, DifficultyChart, AlgorithmRadarChart } from '../components/ChartsExtended';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { query } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null); // Backend user info
    const [submissions, setSubmissions] = useState([]); // Raw submissions for Heatmap
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const { user: currentUser } = useAuth(); // Logged in user
    const [showChat, setShowChat] = useState(false);
    const [chatRoom, setChatRoom] = useState(null);

    const [stats, setStats] = useState({
        solvedCount: 0,
        currentStreak: 0,
        maxStreak: 0,
        tagStats: {},
        languageStats: [],
        difficultyStats: [],
        algorithmStats: [],
        ratingHistory: []
    });

    const processData = (subs) => {
        const acSubs = subs.filter(s => s.verdict === 'OK');
        const solvedProblems = new Set(acSubs.map(s => `${s.contestId}-${s.problem.index}`));
        const tags = {};
        const languages = {};
        const difficulties = {};

        acSubs.forEach(s => {
            s.problem.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
            languages[s.programmingLanguage] = (languages[s.programmingLanguage] || 0) + 1;
            if (s.problem.rating) {
                difficulties[s.problem.rating] = (difficulties[s.problem.rating] || 0) + 1;
            }
        });

        // Basic Streak Logic
        acSubs.sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);
        const dates = [...new Set(acSubs.map(s => new Date(s.creationTimeSeconds * 1000).toDateString()))];
        dates.sort((a, b) => new Date(a) - new Date(b));

        let streak = 0;
        let maxStreakVal = 0;
        let prevDate = null;
        dates.forEach(dateStr => {
            const d = new Date(dateStr);
            if (!prevDate) streak = 1;
            else {
                const diffDays = Math.ceil(Math.abs(d - prevDate) / (1000 * 60 * 60 * 24));
                streak = diffDays === 1 ? streak + 1 : 1;
            }
            maxStreakVal = Math.max(maxStreakVal, streak);
            prevDate = d;
        });

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isActive = dates.includes(today.toDateString()) || dates.includes(yesterday.toDateString());

        // Format for Charts
        const langData = Object.entries(languages).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
        const diffData = Object.entries(difficulties).map(([name, value]) => ({ name, value })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

        // Mock Algorithm Stats (simplifying for now)
        const algData = [
            { subject: 'DP', A: tags['dp'] || 0, fullMark: 150 },
            { subject: 'Greedy', A: tags['greedy'] || 0, fullMark: 150 },
            { subject: 'Graphs', A: (tags['graphs'] || 0) + (tags['dfs and similar'] || 0), fullMark: 150 },
            { subject: 'Math', A: tags['math'] || 0, fullMark: 150 },
            { subject: 'Strings', A: tags['strings'] || 0, fullMark: 150 },
            { subject: 'Trees', A: tags['trees'] || 0, fullMark: 150 },
        ];

        setStats({
            solvedCount: solvedProblems.size,
            tagStats: tags,
            currentStreak: isActive ? streak : 0,
            maxStreak: maxStreakVal,
            languageStats: langData,
            difficultyStats: diffData,
            algorithmStats: algData,
            ratingHistory: []
        });
        setSubmissions(acSubs);
    };

    const handleCompare = () => {
        if (user) {
            navigate(`/compare/${user.handle}`);
        }
    };

    const handleMessage = () => {
        if (currentUser && dbUser) {
            const participants = [currentUser.username, dbUser.username].sort();
            const roomName = `${participants[0]}_${participants[1]}`;
            setChatRoom(roomName);
            setShowChat(true);
        } else {
            alert("Please login to message other users.");
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError('');
            setIsRegistered(false);
            setDbUser(null);

            let handleToFetch = query;

            try {
                // 1. Try to find registered user in backend
                try {
                    const publicRes = await getPublicUser(query);
                    if (publicRes.data.is_registered) {
                        setIsRegistered(true);
                        setDbUser(publicRes.data);
                        handleToFetch = publicRes.data.codeforces_handle; // Use the linked handle
                    }
                } catch {
                    // Not registered or 404, proceed as Guest
                    console.log("User not found in BugSnug backend, trying Codeforces directly...");
                }

                // 2. Fetch Codeforces Data & Submissions
                const [cfResponse, subsResponse] = await Promise.all([
                    getCFUser(handleToFetch),
                    getCFSubmissions(handleToFetch)
                ]);

                if (cfResponse.data.status === 'OK') {
                    setUser(cfResponse.data.result[0]);
                    if (subsResponse.data.status === 'OK') {
                        processData(subsResponse.data.result);
                    }
                } else {
                    setError('User not found on Codeforces');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user data. Please check the handle/username.');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchUser();
        }
    }, [query]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-salmon-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-bittersweet mb-2">Oops!</h2>
            <p className="text-sonic-silver">{error}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-float px-4 md:px-0 max-w-4xl mx-auto">
            {/* Header / Profile Card */}
            <div className="bg-white p-8 rounded-[20px] border border-cultured shadow-card flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-salmon-pink/10 to-sandy-brown/10 z-0"></div>

                <div className="z-10 relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <img
                            src={user.titlePhoto || 'https://via.placeholder.com/150'}
                            alt={user.handle}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isRegistered && (
                        <div className="absolute bottom-0 right-0 bg-ocean-green text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified BugSnug User">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="z-10 flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-eerie-black mb-1 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        {isRegistered ? dbUser.username : user.handle}
                        {isRegistered && <span className="text-xs bg-ocean-green/10 text-ocean-green px-2 py-1 rounded-full border border-ocean-green/20">BugSnug Member</span>}
                        <span className={`text-sm px-3 py-1 rounded-full text-white ${getRankColor(user.rank)}`}>
                            {user.rank ? user.rank.toUpperCase() : 'UNRATED'}
                        </span>
                    </h1>
                    <p className="text-sonic-silver mb-4 flex items-center justify-center md:justify-start gap-2">
                        {isRegistered && <span className="font-mono text-xs bg-cultured px-1.5 py-0.5 rounded text-eerie-black">@{user.handle}</span>}
                        <span>{user.firstName} {user.lastName}</span>
                        <span>•</span>
                        <span>{user.city}, {user.country}</span>
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-cultured px-4 py-2 rounded-[10px] text-center min-w-[100px]">
                            <p className="text-xs text-sonic-silver font-bold uppercase">Rating</p>
                            <p className={`text-xl font-bold ${getRankTextColor(user.rank)}`}>{user.rating || 0}</p>
                        </div>
                        <div className="bg-cultured px-4 py-2 rounded-[10px] text-center min-w-[100px]">
                            <p className="text-xs text-sonic-silver font-bold uppercase">Max Rating</p>
                            <p className="text-xl font-bold text-eerie-black">{user.maxRating || 0}</p>
                        </div>
                        <div className="bg-cultured px-4 py-2 rounded-[10px] text-center min-w-[100px]">
                            <p className="text-xs text-sonic-silver font-bold uppercase">Contribution</p>
                            <p className={`text-xl font-bold ${user.contribution >= 0 ? 'text-ocean-green' : 'text-bittersweet'}`}>
                                {user.contribution > 0 ? '+' : ''}{user.contribution || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex flex-col gap-3">
                    {isRegistered ? (
                        <button
                            onClick={handleMessage}
                            className="px-6 py-2.5 bg-salmon-pink hover:bg-eerie-black text-white font-bold rounded-[10px] shadow-md transition-all active:scale-95 flex items-center gap-2 justify-center"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Message
                        </button>
                    ) : (
                        <div className="text-xs text-center text-sonic-silver max-w-[150px]">
                            User not on BugSnug.<br />Messaging unavailable.
                        </div>
                    )}
                    <button
                        onClick={handleCompare}
                        className="px-6 py-2.5 bg-white border-2 border-salmon-pink text-salmon-pink hover:bg-salmon-pink hover:text-white font-bold rounded-[10px] transition-all active:scale-95 flex items-center gap-2 justify-center"
                    >
                        <BarChart2 className="w-5 h-5" />
                        Compare
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Problems Solved" value={stats.solvedCount} icon={<Zap className="w-6 h-6" />} color="salmon-pink" />
                <StatCard title="Current Streak" value={`${stats.currentStreak} Days`} icon={<Flame className="w-6 h-6" />} color="sandy-brown" />
                <StatCard title="Max Streak" value={`${stats.maxStreak} Days`} icon={<BarChart2 className="w-6 h-6" />} color="bittersweet" />
                <StatCard title="Global Rank" value={`#${user.rank || 'N/A'}`} color="ocean-green" />
            </div>

            {/* Heatmap Section */}
            <div className="bg-white p-8 rounded-[10px] border border-cultured shadow-card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="section-heading text-xl flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sandy-brown"></span>
                        Activity Log
                    </h3>
                </div>
                <Heatmap submissions={submissions} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <DifficultyChart data={stats.difficultyStats} />
                </div>
                <div className="space-y-8">
                    <AlgorithmRadarChart data={stats.algorithmStats} />
                    <LanguageChart data={stats.languageStats} />
                </div>
            </div>

            {/* Registration Status Banner */}
            {!isRegistered && (
                <div className="bg-sandy-brown/10 p-4 rounded-[10px] border border-sandy-brown/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="p-3 bg-white rounded-full text-sandy-brown shadow-sm hidden md:block">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-eerie-black text-lg">Unregistered User</h3>
                        <p className="text-sm text-sonic-silver">
                            This profile is generated from public Codeforces data.
                            <strong> {user.handle}</strong> has not joined BugSnug yet.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-white text-sandy-brown border border-sandy-brown font-bold rounded-[8px] hover:bg-sandy-brown hover:text-white transition-colors text-sm shadow-sm">
                        Invite to Join
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {showChat && (
                <ChatWindow
                    roomName={chatRoom}
                    recipientName={dbUser?.username}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

// Helpers
const getRankColor = (rank) => {
    if (!rank) return 'bg-gray-400';
    if (rank.includes('grandmaster')) return 'bg-red-500';
    if (rank.includes('master')) return 'bg-amber-400';
    if (rank.includes('purple')) return 'bg-purple-500'; // Violet/Candidate Master
    if (rank.includes('blue') || rank.includes('expert')) return 'bg-blue-500';
    if (rank.includes('cyan') || rank.includes('specialist')) return 'bg-cyan-500';
    if (rank.includes('green') || rank.includes('pupil')) return 'bg-green-500';
    return 'bg-gray-400';
};

const getRankTextColor = (rank) => {
    if (!rank) return 'text-gray-400';
    if (rank.includes('grandmaster')) return 'text-red-500';
    if (rank.includes('master')) return 'text-amber-500';
    if (rank.includes('purple')) return 'text-purple-500';
    if (rank.includes('blue') || rank.includes('expert')) return 'text-blue-500';
    if (rank.includes('cyan') || rank.includes('specialist')) return 'text-cyan-500';
    if (rank.includes('green') || rank.includes('pupil')) return 'text-green-500';
    return 'text-gray-400';
};





export default UserProfile;
