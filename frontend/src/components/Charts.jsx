import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'];

export const RatingChart = ({ history }) => {
    // Format history for chart
    // Assuming history is array of { rating, updateTimeSeconds, rank, contestName }
    // We might need to fetch rating history separately or assume it's passed efficiently
    const data = history?.map(h => ({
        date: new Date(h.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
        rating: h.newRating,
        contest: h.contestName
    })) || [];

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-salmon-pink rounded-full"></span>
                Rating History
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#F08080" // Salmon Pink
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#F08080' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ProblemDistributionChart = ({ stats }) => {
    // Stats format: { tag: count }
    const data = Object.entries(stats || {}).map(([name, value]) => ({ name, value }));
    // Sort and take top 5 + others
    data.sort((a, b) => b.value - a.value);
    const topCategories = data.slice(0, 5);
    const otherCount = data.slice(5).reduce((acc, curr) => acc + curr.value, 0);
    if (otherCount > 0) topCategories.push({ name: 'Others', value: otherCount });

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-bittersweet rounded-full"></span>
                Problem Tags
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={topCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {topCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
