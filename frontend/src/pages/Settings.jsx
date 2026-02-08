import React from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useState } from 'react';

const Settings = () => {
    const { user } = useAuth();
    const [handle, setHandle] = useState(user?.codeforces_handle || '');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await api.post('/users/verify-handle/', { handle });
            setMessage('Handle verified successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to verify handle. Make sure it exists.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-float">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

            <div className="glass-card p-8 space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-dark-border pb-4">Profile Settings</h3>

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                            alt="Avatar"
                            className="w-full h-full rounded-full bg-dark-bg"
                        />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">{user?.username}</h4>
                        <p className="text-dark-muted">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <label className="block text-sm font-medium text-dark-muted uppercase tracking-wide">
                        Codeforces Handle
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="flex-1 glass-input px-4 py-2 rounded-xl text-white"
                            placeholder="Enter CF Handle"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                    {message && (
                        <p className={`text-sm ${message.includes('success') ? 'text-accent-emerald' : 'text-secondary'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white border-b border-dark-border pb-4 mb-6">Appearance</h3>
                <div className="flex items-center justify-between">
                    <span className="text-white">Dark Mode</span>
                    <button className="w-12 h-6 bg-primary rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
