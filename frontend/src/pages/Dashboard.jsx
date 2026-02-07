import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="p-6 bg-dark-card rounded-xl shadow border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Codeforces Handle</h3>
                    <p className="text-2xl font-bold text-dark-primary">{user?.codeforces_handle || 'Not Linked'}</p>
                </div>

                {/* Placeholder for Heatmap */}
                <div className="p-6 bg-dark-card rounded-xl shadow border border-gray-700 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-400 mb-4">Activity Heatmap</h3>
                    <div className="h-32 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                        Heatmap Coming Soon
                    </div>
                </div>

                {/* Placeholder for Recent Contests */}
                <div className="p-6 bg-dark-card rounded-xl shadow border border-gray-700 col-span-1 md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-400 mb-4">Recent Submissions</h3>
                    <div className="h-32 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                        Submissions List Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
