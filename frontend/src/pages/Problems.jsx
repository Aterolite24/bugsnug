import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [bookmarks, setBookmarks] = useState(new Set());

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const params = { page };
            if (tags) params.tags = tags;
            if (minRating) params.min_rating = minRating;
            if (maxRating) params.max_rating = maxRating;

            const response = await api.get('/problems/', { params });
            setProblems(response.data.results || []);
            setLoading(false);
        } catch (error) {
            console.error("Fetch problems failed:", error);
            setError('Failed to fetch problems');
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const response = await api.get('/problems/bookmark/');
            // Handle different response structures if needed, assuming array of objects
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

    useEffect(() => {
        fetchProblems();
        fetchBookmarks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProblems();
    };

    const getDifficultyColor = (rating) => {
        if (!rating) return 'text-sonic-silver';
        if (rating < 1200) return 'text-sonic-silver';
        if (rating < 1400) return 'text-ocean-green';
        if (rating < 1600) return 'text-accent-cyan';
        if (rating < 1900) return 'text-salmon-pink';
        if (rating < 2100) return 'text-purple-400';
        if (rating < 2400) return 'text-sandy-brown';
        return 'text-bittersweet';
    };

    return (
        <div className="space-y-6 animate-float px-4 md:px-0">
            <h1 className="text-3xl font-bold text-eerie-black mb-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-sandy-brown rounded-full"></span>
                Problem Set
            </h1>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                        <label className="text-xs text-sonic-silver font-bold uppercase mb-1 block">Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. dp, greedy"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="bg-cultured border border-cultured w-full px-4 py-2 rounded-[10px] text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-salmon-pink/50 transition-all"
                        />
                        <SearchIcon className="absolute right-4 top-9 w-5 h-5 text-sonic-silver" />
                    </div>

                    <div className="w-full md:w-32">
                        <label className="text-xs text-sonic-silver font-bold uppercase mb-1 block">Min Rating</label>
                        <input
                            type="number"
                            placeholder="800"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="bg-cultured border border-cultured w-full px-4 py-2 rounded-[10px] text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-salmon-pink/50 transition-all"
                        />
                    </div>

                    <div className="w-full md:w-32">
                        <label className="text-xs text-sonic-silver font-bold uppercase mb-1 block">Max Rating</label>
                        <input
                            type="number"
                            placeholder="3500"
                            value={maxRating}
                            onChange={(e) => setMaxRating(e.target.value)}
                            className="bg-cultured border border-cultured w-full px-4 py-2 rounded-[10px] text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-salmon-pink/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-2.5 bg-salmon-pink hover:bg-eerie-black text-white font-bold rounded-[10px] transition-all shadow-md active:scale-95"
                    >
                        Filter
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-[10px] border border-cultured shadow-card overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center animate-pulse">
                        <div className="w-12 h-12 border-4 border-salmon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-salmon-pink font-bold">Fetching problems...</p>
                    </div>
                ) : error ? (
                    <div className="p-10 text-center text-bittersweet bg-bittersweet/10 m-4 rounded-[10px] border border-bittersweet/20">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-cultured bg-cultured/30 text-sonic-silver text-xs uppercase tracking-wider backdrop-blur-sm">
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">ID</th>
                                    <th className="px-6 py-4 font-bold">Problem Name</th>
                                    <th className="px-6 py-4 font-bold">Difficulty</th>
                                    <th className="px-6 py-4 font-bold">Tags</th>
                                    <th className="px-6 py-4 font-bold text-center">Solved By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cultured">
                                {problems.map((prob, index) => {
                                    const problemId = `${prob.contestId}${prob.index}`;
                                    const isBookmarked = bookmarks.has(problemId);

                                    return (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            key={problemId}
                                            className="group hover:bg-cultured/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleBookmark(prob)}
                                                    className={`p-2 rounded-full transition-all ${isBookmarked ? 'bg-sandy-brown text-white shadow-md' : 'text-sonic-silver hover:text-sandy-brown hover:bg-sandy-brown/10'}`}
                                                >
                                                    <BookmarkIcon filled={isBookmarked} className="w-4 h-4" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-mono text-salmon-pink font-bold hover:underline hover:text-eerie-black transition-colors"
                                                >
                                                    {prob.contestId}{prob.index}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-eerie-black group-hover:text-salmon-pink transition-colors text-lg">
                                                {prob.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold px-3 py-1 rounded-full bg-cultured border border-cultured-darker ${getDifficultyColor(prob.rating)}`}>
                                                    {prob.rating || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {prob.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="px-2 py-1 rounded-[5px] bg-cultured border border-cultured-darker text-xs text-sonic-silver whitespace-nowrap group-hover:border-salmon-pink/30 transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {prob.tags.length > 3 && (
                                                        <span className="text-xs text-sonic-silver self-center bg-cultured px-2 py-1 rounded-[5px]">+{prob.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-sonic-silver text-center">
                                                <div className="flex items-center justify-center gap-1 bg-cultured py-1 px-3 rounded-full w-fit mx-auto border border-cultured-darker">
                                                    <UserIcon className="w-3 h-3" />
                                                    <span className="font-mono">{prob.solvedCount?.toLocaleString()}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-2 bg-white border border-cultured hover:bg-cultured disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-eerie-black flex items-center gap-2 rounded-[10px] shadow-sm"
                >
                    &larr; Previous
                </button>
                <div className="flex items-center justify-center px-4 bg-white border border-salmon-pink/30 rounded-[10px] shadow-sm min-w-[3rem] font-bold text-salmon-pink">
                    {page}
                </div>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 bg-white border border-cultured hover:bg-cultured transition-colors font-bold text-eerie-black flex items-center gap-2 rounded-[10px] shadow-sm"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

// Icons
const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BookmarkIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default Problems;
