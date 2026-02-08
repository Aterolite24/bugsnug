import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Lazy init for purity
    const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await api.get('/contests/');
                setContests(response.data);
                setLoading(false);
            } catch {
                setError('Failed to fetch contests');
                setLoading(false);
            }
        };

        fetchContests();
        const interval = setInterval(() => {
            setNow(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeLeft = (startTimeSeconds) => {
        const diff = startTimeSeconds - now;

        if (diff <= 0) return "Started";

        const days = Math.floor(diff / (24 * 3600));
        const hours = Math.floor((diff % (24 * 3600)) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-primary">Syncing Contests...</div>;
    if (error) return <div className="p-10 text-center text-secondary">{error}</div>;

    return (
        <div className="space-y-6 animate-float">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-accent-amber rounded-full"></span>
                Upcoming Contests
            </h1>

            <div className="grid grid-cols-1 gap-4">
                {contests.length === 0 ? (
                    <div className="glass-card p-10 text-center text-dark-muted">
                        No upcoming contests found. Time to practice!
                    </div>
                ) : (
                    contests.map((contest, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={contest.id}
                            className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-primary/50 transition-colors"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {contest.name}
                                </h3>
                                <div className="flex gap-4 mt-2 text-sm text-dark-muted">
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="w-4 h-4" />
                                        {contest.durationSeconds / 60} mins
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-xs">
                                        {contest.type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-right">
                                <div className="text-sm text-dark-muted">Starts in</div>
                                <div className="text-2xl font-mono font-bold text-accent-cyan neon-text">
                                    {formatTimeLeft(contest.startTimeSeconds)}
                                </div>
                                <p className="text-xs text-dark-muted">
                                    {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                                </p>
                                <a
                                    href={`https://codeforces.com/contests/${contest.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-lg shadow-primary/20"
                                >
                                    Register
                                </a>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Contests;
