/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error("User fetch failed", error);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUserLoggedIn(); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/users/token/', { username, password });
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        await checkUserLoggedIn();
    };

    const register = async (username, email, password, handle) => {
        await api.post('/users/register/', { username, email, password, codeforces_handle: handle });
        await login(username, password);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
