import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getChatHistory } from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const { user } = useAuth(); // We can access user here if needed

    const connect = async (roomName) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const token = localStorage.getItem('access');
        if (!token) {
            setError("Authentication token missing. Please login.");
            return;
        }

        setError(null); // Clear previous errors

        // Fetch History
        if (user) {
            try {
                const participants = roomName.split('_');
                // Identify the other user in the room name (user1_user2)
                const otherUsername = participants.find(p => p !== user.username) || participants[0]; // Fallback for self-chat

                if (otherUsername) {
                    const historyRes = await getChatHistory(otherUsername);
                    if (historyRes.status === 200) {
                        setMessages(historyRes.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        }

        // Dynamic WebSocket URL handling
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        // Extract hostname and port from API URL
        let wsUrl = apiBase.replace('http://', 'ws://').replace('https://', 'wss://').replace('/api', '');

        // Ensure accurate base URL if VITE_API_URL is just a relative path or missing
        if (!wsUrl.startsWith('ws')) {
            const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const host = window.location.hostname;
            // Assuming backend is on port 8000 if running locally, otherwise use window port or inferred
            const port = window.location.hostname === 'localhost' ? '8000' : window.location.port;
            wsUrl = `${wsScheme}://${host}:${port}`;
        }

        const url = `${wsUrl}/ws/chat/${roomName}/?token=${token}`;
        console.log("Connecting to WebSocket:", url);

        try {
            socketRef.current = new WebSocket(url);

            socketRef.current.onopen = () => {
                console.log('WebSocket Connected');
                setIsConnected(true);
                setError(null);
            };

            socketRef.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setMessages((prev) => [...prev, data]);
            };

            socketRef.current.onerror = (e) => {
                console.error('WebSocket Error', e);
                setError("Connection error. Please try again.");
            };

            socketRef.current.onclose = (e) => {
                console.log('WebSocket Disconnected', e.code, e.reason);
                setIsConnected(false);
                if (e.code !== 1000) { // 1000 is normal closure
                    // setError("Connection lost."); 
                }
            };
        } catch (err) {
            console.error("WebSocket init failed:", err);
            setError("Failed to initialize connection.");
        }
    };

    const sendMessage = (message, sender) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message, sender }));
        } else {
            console.error('WebSocket is not open');
            setError("Cannot send message: Disconnected.");
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        setIsConnected(false);
        setMessages([]); // Optional: clear messages on disconnect/room switch
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <ChatContext.Provider value={{ messages, isConnected, error, connect, disconnect, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};
