import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';

const ChatWidget = () => {
    const { isChatOpen, closeChat, chatPartner, currentUser } = useApp();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (isChatOpen) {
            let initialMessages = [];
            if (chatPartner.context) {
                initialMessages.push({ text: chatPartner.context, type: 'system' });
            }
            initialMessages.push({ text: `Hello! You are now chatting with ${chatPartner.name}.`, type: 'received', sender: chatPartner.name });
            setMessages(initialMessages);
        }
    }, [isChatOpen, chatPartner]);

    const handleSendMessage = () => {
        if (!message.trim()) return;
        
        const newMessages = [...messages, { text: message, type: 'sent', sender: 'You' }];
        setMessages(newMessages);
        setMessage('');

        setTimeout(() => {
            const reply = { text: "Thanks for your message! I'll get back to you soon.", type: 'received', sender: chatPartner.name };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    if (!isChatOpen) return null;

    return (
        <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
            <div className="chat-header">
                <span className="chat-header-contact-name">Chat with {chatPartner?.name || 'Support'}</span>
                <button className="chat-close-btn" onClick={closeChat}>×</button>
            </div>
            <div className="chat-messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        {msg.type !== 'system' && <span className="message-sender">{msg.sender}</span>}
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-area">
                <input 
                    type="text" 
                    className="chat-message-input" 
                    placeholder="Type your message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!currentUser}
                />
                <button className="chat-send-message-btn" onClick={handleSendMessage} disabled={!currentUser}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;