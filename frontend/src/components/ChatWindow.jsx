import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';

const ChatWindow = ({ roomName, onClose, recipientName }) => {
    const { messages, sendMessage, connect, disconnect, isConnected, error } = useChat();
    const { user } = useAuth();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (roomName) {
            connect(roomName);
        }
        return () => {
            disconnect();
        };
    }, [roomName]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim() && isConnected) {
            sendMessage(inputText, user?.username || 'Anonymous');
            setInputText('');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
            {/* Header */}
            <div className={`flex justify-between items-center p-3 text-white rounded-t-lg transition-colors ${isConnected ? 'bg-salmon-pink' : 'bg-gray-500'}`}>
                <div className="font-bold flex items-center gap-2">
                    {isConnected ? (
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    ) : (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-200" />
                    )}
                    {recipientName || 'Chat'}
                </div>
                <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
                    <X size={18} />
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 text-red-600 p-2 text-xs flex items-center gap-2 border-b border-red-100">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {!isConnected && !error && (
                    <div className="text-center text-gray-400 text-xs mt-2 flex justify-center items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
                    </div>
                )}

                {messages.length === 0 && isConnected ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender === user?.username;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${isMe
                                    ? 'bg-salmon-pink text-black rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-black rounded-tl-none'
                                    }`}>
                                    {!isMe && <div className="text-[10px] opacity-70 mb-0.5">{msg.sender}</div>}
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2 bg-white rounded-b-lg">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-salmon-pink focus:ring-1 focus:ring-salmon-pink disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim() || !isConnected}
                    className="p-2 bg-salmon-pink text-white rounded-full hover:bg-salmon-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
