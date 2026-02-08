import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCFUser } from '../services/api';
import { ComparisonRadarChart, ComparisonBarChart, RatingComparisonChart } from '../components/ChartsComparison';

const Comparison = () => {
    const { handle } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [handle1, setHandle1] = useState(user?.codeforces_handle || '');
    const [handle2, setHandle2] = useState(handle || '');

    // Data state
    const [user1Data, setUser1Data] = useState(null);
    const [user2Data, setUser2Data] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [comparisonData, setComparisonData] = useState({
        radar: [],
        bar: [],
        line: []
    });

    const fetchComparison = async (h1, h2) => {
        setLoading(true);
        setError('');
        setUser1Data(null);
        setUser2Data(null);

        try {
            // 1. Fetch User Info for both
            const [res1, res2] = await Promise.all([
                getCFUser(h1),
                getCFUser(h2)
            ]);

            if (res1.data.status === 'OK') setUser1Data(res1.data.result[0]);
            if (res2.data.status === 'OK') setUser2Data(res2.data.result[0]);

            // 2. Generate Comparison Data (Mock for now, replacing previous logic)
            // Real implementation would aggregate submissions.
            generateMockData();

        } catch (err) {
            console.error(err);
            setError('Failed to fetch data. Check handles and try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = () => {
        const radar = [
            { subject: 'DP', A: Math.floor(Math.random() * 150), B: Math.floor(Math.random() * 150), fullMark: 150 },
            { subject: 'Greedy', A: Math.floor(Math.random() * 150), B: Math.floor(Math.random() * 150), fullMark: 150 },
            { subject: 'Graphs', A: Math.floor(Math.random() * 150), B: Math.floor(Math.random() * 150), fullMark: 150 },
            { subject: 'Math', A: Math.floor(Math.random() * 150), B: Math.floor(Math.random() * 150), fullMark: 150 },
            { subject: 'Strings', A: Math.floor(Math.random() * 150), B: Math.floor(Math.random() * 150), fullMark: 150 },
        ];
        const bar = [
            { name: '800', A: Math.floor(Math.random() * 50), B: Math.floor(Math.random() * 50) },
            { name: '1000', A: Math.floor(Math.random() * 40), B: Math.floor(Math.random() * 40) },
            { name: '1200', A: Math.floor(Math.random() * 30), B: Math.floor(Math.random() * 30) },
            { name: '1400', A: Math.floor(Math.random() * 20), B: Math.floor(Math.random() * 20) },
            { name: '1600+', A: Math.floor(Math.random() * 10), B: Math.floor(Math.random() * 10) },
        ];
        const line = [
            { name: 'Jan', A: 1200, B: 1100 },
            { name: 'Feb', A: 1250, B: 1150 },
            { name: 'Mar', A: 1300, B: 1180 },
            { name: 'Apr', A: 1280, B: 1250 },
            { name: 'May', A: 1350, B: 1300 },
            { name: 'Jun', A: 1400, B: 1320 },
        ];
        setComparisonData({ radar, bar, line });
    };

    useEffect(() => {
        if (handle) {
            setHandle2(handle);
            if (handle1 && handle) {
                fetchComparison(handle1, handle);
            }
        }
    }, [handle]);

    const handleCompareSubmit = (e) => {
        e.preventDefault();
        if (handle1 && handle2) {
            navigate(`/compare/${handle2}`); // Update URL to reflect target
            fetchComparison(handle1, handle2); // Fetch immediately
        }
    };

    return (
        <div className="space-y-8 animate-float px-4 md:px-0">
            <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card">
                <h1 className="text-3xl font-bold text-eerie-black mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                    Head-to-Head Comparison
                </h1>

                <form onSubmit={handleCompareSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-sonic-silver font-bold uppercase mb-1 block">User 1 (You)</label>
                        <input
                            type="text"
                            value={handle1}
                            onChange={(e) => setHandle1(e.target.value)}
                            className="bg-cultured border border-cultured w-full px-4 py-3 rounded-[10px] text-eerie-black focus:outline-none focus:ring-2 focus:ring-salmon-pink/50 transition-all font-bold"
                            placeholder="Handle 1"
                        />
                    </div>
                    <div className="hidden md:flex pb-4 text-sonic-silver font-bold">VS</div>
                    <div className="flex-1 w-full">
                        <label className="text-xs text-sonic-silver font-bold uppercase mb-1 block">User 2 (Opponent)</label>
                        <input
                            type="text"
                            value={handle2}
                            onChange={(e) => setHandle2(e.target.value)}
                            className="bg-cultured border border-cultured w-full px-4 py-3 rounded-[10px] text-eerie-black focus:outline-none focus:ring-2 focus:ring-ocean-green/50 transition-all font-bold"
                            placeholder="Handle 2"
                        />
                    </div>
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-[10px] transition-all shadow-md active:scale-95">
                        Compare
                    </button>
                </form>
                {error && <p className="text-bittersweet mt-4 font-medium">{error}</p>}
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : user1Data && user2Data ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[10px] border border-cultured shadow-card">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-salmon-pink mx-auto mb-2 shadow-md">
                                <img src={user1Data.titlePhoto} alt={user1Data.handle} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-bold text-lg text-eerie-black">{user1Data.handle}</p>
                            <p className="text-sm text-sonic-silver">Rating: <span className="font-bold text-salmon-pink">{user1Data.rating}</span></p>
                        </div>

                        <div className="text-3xl font-bold text-purple-200">VS</div>

                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-ocean-green mx-auto mb-2 shadow-md">
                                <img src={user2Data.titlePhoto} alt={user2Data.handle} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-bold text-lg text-eerie-black">{user2Data.handle}</p>
                            <p className="text-sm text-sonic-silver">Rating: <span className="font-bold text-ocean-green">{user2Data.rating}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ComparisonRadarChart data={comparisonData.radar} user1={user1Data.handle} user2={user2Data.handle} />
                        <ComparisonBarChart data={comparisonData.bar} user1={user1Data.handle} user2={user2Data.handle} />
                    </div>

                    <div className="w-full">
                        <RatingComparisonChart data={comparisonData.line} user1={user1Data.handle} user2={user2Data.handle} />
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-sonic-silver">
                    Enter two handles above to start comparing their statistics!
                </div>
            )}
        </div>
    );
};

export default Comparison;
