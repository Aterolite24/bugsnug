import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line
} from 'recharts';

export const ComparisonRadarChart = ({ data, user1, user2 }) => {
    // data: [{ subject: 'DP', A: 120, B: 110, fullMark: 150 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-sonic-silver">No data</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4">Algorithm Mastery Comparison</h3>
            <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#94a3b8" />
                    <Radar name={user1} dataKey="A" stroke="#F08080" strokeWidth={2} fill="#F08080" fillOpacity={0.3} />
                    <Radar name={user2} dataKey="B" stroke="#20B2AA" strokeWidth={2} fill="#20B2AA" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ComparisonBarChart = ({ data, user1, user2 }) => {
    // data: [{ name: '800', A: 50, B: 30 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-sonic-silver">No data</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4">Problem Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="A" name={user1} fill="#F08080" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="B" name={user2} fill="#20B2AA" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const RatingComparisonChart = ({ data, user1, user2 }) => {
    // data: [{ name: 'Contest 1', A: 1400, B: 1200 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-sonic-silver">No data</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4">Rating Progression</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="A" name={user1} stroke="#F08080" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="B" name={user2} stroke="#20B2AA" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
