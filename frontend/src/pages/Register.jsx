import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [handle, setHandle] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password, handle);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Handle might be invalid or username taken.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark-bg text-dark-text">
            <div className="w-full max-w-md p-8 space-y-6 bg-dark-card rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-dark-primary">Join Bugsnug</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Codeforces Handle</label>
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                            placeholder="Optional but recommended"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-dark-primary text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white bg-dark-primary rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center text-sm">
                    <p>Already have an account? <Link to="/login" className="text-dark-primary hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
