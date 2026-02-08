import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const StatCard = ({ title, value, icon, change, color = 'salmon-pink' }) => {
    // Map generic color names to specific Tailwind classes if needed, or pass exact color classes
    const colorClasses = {
        'salmon-pink': 'text-salmon-pink bg-salmon-pink/10',
        'ocean-green': 'text-ocean-green bg-ocean-green/10',
        'bittersweet': 'text-bittersweet bg-bittersweet/10',
        'sandy-brown': 'text-sandy-brown bg-sandy-brown/10',
        // Fallbacks for old theme names
        'primary': 'text-salmon-pink bg-salmon-pink/10',
        'secondary': 'text-bittersweet bg-bittersweet/10',
        'emerald': 'text-ocean-green bg-ocean-green/10',
        'amber': 'text-sandy-brown bg-sandy-brown/10',
    };

    const activeColorClass = colorClasses[color] || colorClasses['primary'];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[10px] border border-cultured shadow-card hover:shadow-card-hover transition-all"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-[5px] ${activeColorClass}`}>
                    {icon && React.cloneElement(icon, { className: "w-6 h-6" })}
                </div>
                <div>
                    <h3 className="text-onyx text-sm font-medium uppercase tracking-wide mb-1 opacity-70">{title}</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-eerie-black">{value}</span>
                        {change && (
                            <span className={`text-xs font-semibold ${change >= 0 ? 'text-ocean-green' : 'text-bittersweet'}`}>
                                {change > 0 ? '+' : ''}{change}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
