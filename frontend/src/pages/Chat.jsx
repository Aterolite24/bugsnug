import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState('global'); // 'global' or userId
    const [messages, setMessages] = useState({
        global: [
            { id: 1, sender: 'System', text: 'Welcome to the BugSnug community chat!', time: '10:00 AM' },
            { id: 2, sender: 'Alice', text: 'Has anyone solved Problem C yet?', time: '10:05 AM' },
            { id: 3, sender: 'Bob', text: 'Yeah, it\'s a standard DP problem.', time: '10:07 AM' },
        ],
        // Mock DM data
        'alice': [{ id: 1, sender: 'Alice', text: 'Hey! Want to practice together?', time: '09:30 AM' }]
    });
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChannel]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            sender: user.username,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages(prev => ({
            ...prev,
            [activeChannel]: [...(prev[activeChannel] || []), msg]
        }));
        setNewMessage('');

        // Mock reply for global chat only
        if (activeChannel === 'global') {
            setTimeout(() => {
                const reply = {
                    id: Date.now() + 1,
                    sender: 'Bot',
                    text: `Nice point, @${user.username}!`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => ({
                    ...prev,
                    [activeChannel]: [...prev[activeChannel], reply]
                }));
            }, 2000);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-float container mx-auto fade-in">
            {/* Channels Sidebar */}
            <div className="w-64 bg-white rounded-[10px] border border-cultured shadow-card flex flex-col overflow-hidden hidden md:flex">
                <div className="p-4 border-b border-cultured bg-cultured/30">
                    <h2 className="text-sm font-bold text-onyx uppercase tracking-wider">Channels</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <button
                        onClick={() => setActiveChannel('global')}
                        className={`w-full text-left px-3 py-2 rounded-[5px] flex items-center gap-2 transition-all ${activeChannel === 'global' ? 'bg-salmon-pink/10 text-salmon-pink font-medium' : 'text-sonic-silver hover:bg-cultured'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-ocean-green"></span>
                        Global Chat
                    </button>
                    <div className="mt-4 px-3 mb-2">
                        <h3 className="text-xs font-bold text-sonic-silver uppercase">Direct Messages</h3>
                    </div>
                    <button
                        onClick={() => setActiveChannel('alice')}
                        className={`w-full text-left px-3 py-2 rounded-[5px] flex items-center gap-2 transition-all ${activeChannel === 'alice' ? 'bg-salmon-pink/10 text-salmon-pink font-medium' : 'text-sonic-silver hover:bg-cultured'}`}
                    >
                        <div className="w-2 h-2 rounded-full bg-cultured border border-sonic-silver"></div>
                        Alice
                    </button>
                    {/* More mock DMs could go here */}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-[10px] border border-cultured shadow-card overflow-hidden">
                <div className="p-4 border-b border-cultured bg-white flex justify-between items-center shadow-sm z-10">
                    <h2 className="text-lg font-bold text-eerie-black flex items-center gap-2">
                        {activeChannel === 'global' ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-ocean-green animate-pulse"></span>
                                Global Chat
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-sandy-brown"></span>
                                @{activeChannel}
                            </>
                        )}

                    </h2>
                    <span className="text-xs text-sonic-silver font-medium bg-cultured px-2 py-1 rounded-full">12 Online</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dots-pattern">
                    <AnimatePresence>
                        {(messages[activeChannel] || []).map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                key={msg.id}
                                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`max-w-[70%] rounded-[10px] p-3 shadow-sm ${msg.isMe
                                    ? 'bg-salmon-pink text-white rounded-br-none'
                                    : 'bg-cultured text-eerie-black rounded-bl-none border border-cultured-darker'
                                    }`}>
                                    {!msg.isMe && <p className="text-xs font-bold text-salmon-pink mb-1">{msg.sender}</p>}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                <span className="text-[10px] text-sonic-silver mt-1 px-1 font-medium">{msg.time}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white border-t border-cultured flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${activeChannel === 'global' ? '#global' : '@' + activeChannel}...`}
                        className="flex-1 bg-cultured border border-cultured rounded-[10px] px-4 py-3 text-eerie-black placeholder-sonic-silver focus:outline-none focus:ring-2 focus:ring-salmon-pink/20 transition-all"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-salmon-pink hover:bg-eerie-black text-white rounded-[10px] transition-all shadow-md active:scale-95"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

const SendIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export default Chat;
