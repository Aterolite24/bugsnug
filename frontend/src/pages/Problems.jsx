import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [bookmarks, setBookmarks] = useState(new Set());

    useEffect(() => {
        fetchProblems();
        fetchBookmarks();
    }, [page]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const params = { page };
            if (tags) params.tags = tags;
            const response = await api.get('/problems/', { params });
            setProblems(response.data.results || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch problems');
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await api.get('/problems/bookmark/');
            const bookmarkedIds = new Set(response.data.map(b => `${b.contest_id}${b.index}`));
            setBookmarks(bookmarkedIds);
        } catch (err) {
            console.error("Failed to fetch bookmarks", err);
        }
    };

    const toggleBookmark = async (problem) => {
        const problemId = `${problem.contestId}${problem.index}`;
        try {
            await api.post('/problems/bookmark/', {
                contest_id: problem.contestId,
                index: problem.index,
                name: problem.name
            });

            setBookmarks(prev => {
                const newBookmarks = new Set(prev);
                if (newBookmarks.has(problemId)) {
                    newBookmarks.delete(problemId);
                } else {
                    newBookmarks.add(problemId);
                }
                return newBookmarks;
            });
        } catch (err) {
            console.error("Failed to toggle bookmark", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProblems();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Problem Set</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4">
                <input
                    type="text"
                    placeholder="Filter by tags (e.g. dp,greedy)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-dark-primary text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center text-white mt-10">Loading problems...</div>
            ) : error ? (
                <div className="text-center text-red-500 mt-10">{error}</div>
            ) : (
                <div className="overflow-x-auto bg-dark-card rounded-xl shadow border border-gray-700">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Tags</th>
                                <th className="px-6 py-4">Solved</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {problems.map((prob) => {
                                const problemId = `${prob.contestId}${prob.index}`;
                                const isBookmarked = bookmarks.has(problemId);

                                return (
                                    <tr key={problemId} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleBookmark(prob)} className="text-xl">
                                                <ion-icon name={isBookmarked ? "bookmark" : "bookmark-outline"} style={{ color: isBookmarked ? '#F1B4BB' : 'gray' }}></ion-icon>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-dark-primary font-bold">
                                            <a
                                                href={`https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {prob.contestId}{prob.index}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">{prob.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${prob.rating < 1200 ? 'text-gray-400' :
                                                prob.rating < 1400 ? 'text-green-400' :
                                                    prob.rating < 1600 ? 'text-cyan-400' :
                                                        prob.rating < 1900 ? 'text-blue-500' :
                                                            prob.rating < 2100 ? 'text-purple-500' :
                                                                prob.rating < 2400 ? 'text-orange-500' : 'text-red-500'
                                                }`}>
                                                {prob.rating || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {prob.tags.join(', ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            x{prob.solvedCount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="py-2 text-white">Page {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Problems;
