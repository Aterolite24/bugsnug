import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-dark-card border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-dark-primary">Bugsnug</Link>
                        {user && (
                            <div className="hidden md:flex space-x-4">
                                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Dashboard</Link>
                                <Link to="/contests" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Contests</Link>
                                <Link to="/problems" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Problems</Link>
                                <Link to="/friends" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium">Friends</Link>
                            </div>
                        )}
                    </div>
                    <div>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300">Hello, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
                                <Link to="/register" className="text-gray-300 hover:text-white transition">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
