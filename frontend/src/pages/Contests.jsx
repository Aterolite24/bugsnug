import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContests();
    }, []);

    const fetchContests = async () => {
        try {
            const response = await api.get('/contests/');
            setContests(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch contests');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center text-white mt-10">Loading contests...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Upcoming Contests</h1>
            <div className="grid grid-cols-1 gap-4">
                {contests.length === 0 ? (
                    <p className="text-gray-400">No upcoming contests found.</p>
                ) : (
                    contests.map((contest) => (
                        <div key={contest.id} className="bg-dark-card p-6 rounded-xl shadow border border-gray-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-dark-primary">{contest.name}</h3>
                                <p className="text-gray-400">Duration: {contest.durationSeconds / 60} mins</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-white">
                                    {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                                </p>
                                <a
                                    href={`https://codeforces.com/contests/${contest.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                                >
                                    Register on CF
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contests;
