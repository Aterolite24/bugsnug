import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSubmissions } from '../services/api';
import StatCard from '../components/StatCard';
import Heatmap from '../components/Heatmap';
import { RatingChart, ProblemDistributionChart } from '../components/Charts';
import { LanguageChart, DifficultyChart, AlgorithmRadarChart } from '../components/ChartsExtended';

// Icons
const LightningIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ChartBarIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const FireIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
);

const RefreshIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`${className} cursor-pointer hover:rotate-180 transition-transform duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        solvedCount: 0,
        currentStreak: 0,
        maxStreak: 0,
        tagStats: {},
        languageStats: [
            { name: 'C++', value: 150 },
            { name: 'Python', value: 80 },
            { name: 'Java', value: 40 },
            { name: 'JavaScript', value: 20 },
        ],
        difficultyStats: [
            { name: '800', value: 45 },
            { name: '900', value: 30 },
            { name: '1000', value: 25 },
            { name: '1100', value: 15 },
            { name: '1200', value: 10 },
        ],
        algorithmStats: [
            { subject: 'DP', A: 120, fullMark: 150 },
            { subject: 'Greedy', A: 98, fullMark: 150 },
            { subject: 'Graphs', A: 86, fullMark: 150 },
            { subject: 'Math', A: 99, fullMark: 150 },
            { subject: 'Strings', A: 85, fullMark: 150 },
            { subject: 'Trees', A: 65, fullMark: 150 },
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getUserSubmissions();
                processData(data);
            } catch (error) {
                console.error("Failed to fetch submissions", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.codeforces_handle) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const processData = (subs) => {
        const acSubs = subs.filter(s => s.verdict === 'OK');
        const solvedProblems = new Set(acSubs.map(s => `${s.contestId}-${s.problem.index}`));
        const tags = {};
        acSubs.forEach(s => {
            s.problem.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
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

        // Check active streak
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isActive = dates.includes(today.toDateString()) || dates.includes(yesterday.toDateString());

        setSubmissions(acSubs);
        setStats(prev => ({
            ...prev,
            solvedCount: solvedProblems.size,
            tagStats: tags,
            currentStreak: isActive ? streak : 0,
            maxStreak: maxStreakVal
        }));
    };

    const handleSolveRandom = () => {
        // Redirect to a random problem (mock logic for now, or use CF problemset/random implementation if exists)
        window.open('https://codeforces.com/problemset/problem/4/A', '_blank');
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-salmon-pink border-t-transparent rounded-full animate-spin"></div></div>;

    if (!user?.codeforces_handle) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-3xl font-bold mb-4 text-onyx">Link your Codeforces Handle</h2>
                <p className="text-sonic-silver mb-8 text-lg">Connect your account to unlock professional analytics.</p>
                <button className="px-8 py-3 bg-salmon-pink hover:bg-eerie-black text-white rounded-[10px] font-bold shadow-md transition-all">
                    Connect Now
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-float container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 bg-white p-6 rounded-[10px] border border-cultured shadow-card">
                <div>
                    <h1 className="text-3xl font-bold text-eerie-black mb-2 tracking-tight">
                        Hello, <span className="text-salmon-pink">{user.username}</span>
                    </h1>
                    <p className="text-sonic-silver text-lg">Your daily coding digest is ready.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSolveRandom}
                        className="px-6 py-2.5 bg-salmon-pink hover:bg-eerie-black text-white font-bold rounded-[10px] shadow-sm transition-all active:scale-95 flex items-center gap-2"
                    >
                        <LightningIcon className="w-5 h-5" />
                        Solve Random
                    </button>

                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-salmon-pink bg-salmon-pink/10 px-4 py-2 rounded-full border border-salmon-pink/20">
                            Daily: <span className="text-eerie-black">CF #891 C</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Problems Solved" value={stats.solvedCount} icon={<LightningIcon />} color="salmon-pink" change={3.2} />
                <StatCard title="Current Streak" value={`${stats.currentStreak} Days`} icon={<FireIcon className="w-6 h-6" />} color="sandy-brown" />
                <StatCard title="Max Streak" value={`${stats.maxStreak} Days`} icon={<ChartBarIcon />} color="bittersweet" />
                <StatCard title="Global Rank" value={`#${user.rank || 'N/A'}`} color="ocean-green" />
            </div>

            {/* Heatmap Section */}
            <div className="bg-white p-8 rounded-[10px] border border-cultured shadow-card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="section-heading text-xl flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sandy-brown"></span>
                        Activity Log
                    </h3>
                    <RefreshIcon className="w-5 h-5 text-sonic-silver hover:text-salmon-pink cursor-pointer transition-colors" onClick={() => window.location.reload()} />
                </div>
                <Heatmap submissions={submissions} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rating & Detailed Stats */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
                        <h3 className="section-heading text-lg mb-4">Rating Progression</h3>
                        <div className="h-full pb-8">
                            <RatingChart history={stats.ratingHistory} />
                        </div>
                    </div>
                    <DifficultyChart data={stats.difficultyStats} />
                </div>

                {/* Algorithmic & Language Stats */}
                <div className="space-y-8">
                    <AlgorithmRadarChart data={stats.algorithmStats} />
                    <LanguageChart data={stats.languageStats} />
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
