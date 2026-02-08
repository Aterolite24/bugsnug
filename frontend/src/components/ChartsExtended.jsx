import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';

const COLORS = ['#F08080', '#F4978E', '#F8AD9D', '#FBC4AB', '#FFDAB9', '#90EE90', '#20B2AA'];

export const LanguageChart = ({ data }) => {
    // data format: [{ name: 'C++', value: 120 }, { name: 'Python', value: 45 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] bg-white rounded-[10px] border border-cultured shadow-card flex items-center justify-center text-sonic-silver">No language data available</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-salmon-pink rounded-full"></span>
                Language Usage
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const DifficultyChart = ({ data }) => {
    // data format: [{ name: '800', value: 50 }, { name: '900', value: 30 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] bg-white rounded-[10px] border border-cultured shadow-card flex items-center justify-center text-sonic-silver">No difficulty data available</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-bittersweet rounded-full"></span>
                Problem Difficulty
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#F08080" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const AlgorithmRadarChart = ({ data }) => {
    // data format: [{ subject: 'DP', A: 120, fullMark: 150 }, ...]
    if (!data || data.length === 0) return <div className="h-[400px] bg-white rounded-[10px] border border-cultured shadow-card flex items-center justify-center text-sonic-silver">No algorithm data available</div>;

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card h-[400px]">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ocean-green rounded-full"></span>
                Algorithm Mastery
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#94a3b8" />
                    <Radar
                        name="My Stats"
                        dataKey="A"
                        stroke="#20B2AA"
                        strokeWidth={2}
                        fill="#20B2AA"
                        fillOpacity={0.4}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
