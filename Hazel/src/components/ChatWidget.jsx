import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../hooks/useApp';
import { runChat as runAiChat } from '../gemini';

const ChatWidget = () => {
    // Global state for real-time user-to-user chat
    const { isChatOpen, closeChat, chatPartner, currentUser, sendMessage, chatMessages: realTimeMessages } = useApp();
    
    // Local state for temporary AI chat sessions
    const [localMessages, setLocalMessages] = useState([]);
    
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const isAiSupportChat = chatPartner?.email === 'admin@hazel.com';
    const messagesToDisplay = isAiSupportChat ? localMessages : realTimeMessages;

    const quickQuestions = [ "Where is the FAQ page?", "How do I contact an owner?", "How do I contact an admin?" ];
    const showQuickQuestions = isAiSupportChat && messagesToDisplay.filter(msg => msg.isUser).length === 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initialize AI chat when it opens
    useEffect(() => {
        if (isChatOpen && isAiSupportChat) {
            setLocalMessages([{
                content: `Hello ${currentUser?.firstName || ''}! You are chatting with HAZEL's AI Assistant. How can I help you?`,
                sender_email: 'admin@hazel.com',
                created_at: new Date().toISOString()
            }]);
        }
    }, [isChatOpen, isAiSupportChat, chatPartner, currentUser]);

    useEffect(scrollToBottom, [messagesToDisplay]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || isLoading) return;
        
        const userMessage = { 
            content: messageText, 
            sender_email: currentUser.email, 
            isUser: true, 
            created_at: new Date().toISOString() 
        };

        setIsLoading(true);
        setMessage('');

        if (isAiSupportChat) {
            setLocalMessages(prev => [...prev, userMessage]);
            try {
                const aiResponse = await runAiChat(messageText);
                const aiMessage = { content: aiResponse, sender_email: 'admin@hazel.com', created_at: new Date().toISOString() };
                setLocalMessages(prev => [...prev, aiMessage]);
            } catch (error) {
                 const errorMessage = { content: `Error: ${error.message}`, sender_email: 'admin@hazel.com', created_at: new Date().toISOString() };
                setLocalMessages(prev => [...prev, errorMessage]);
            }
        } else {
            // Send user-to-user message via context
            await sendMessage(messageText);
        }
        
        setIsLoading(false);
    };

    if (!isChatOpen || !chatPartner) return null;

    return (
        <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
            <div className="chat-header">
                <span className="chat-header-contact-name">Chat with {chatPartner.name}</span>
                <button className="chat-close-btn" onClick={closeChat}>×</button>
            </div>
            <div className="chat-messages-container">
                {messagesToDisplay.map((msg, index) => {
                    const isSent = msg.sender_email === currentUser.email;
                    const messageTime = new Date(msg.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                    return (
                        <div key={msg.id || `local-${index}`} className={`chat-message ${isSent ? 'sent' : 'received'}`}>
                            <div className="message-content">
                                <span className="message-sender">{isSent ? 'You' : chatPartner.name}</span>
                                {msg.content}
                                <span className="message-timestamp">{messageTime}</span>
                            </div>
                        </div>
                    );
                })}
                
                {isLoading && (
                    <div className="chat-message received">
                        <div className="message-content">
                            <span className="message-sender">{chatPartner.name}</span>
                            <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {showQuickQuestions && (
                <div className="quick-questions-area">
                    {quickQuestions.map((q, i) => (
                        <button key={i} className="btn btn-outline btn-small" onClick={() => handleSendMessage(q)} disabled={isLoading}>{q}</button>
                    ))}
                </div>
            )}

            <div className="chat-input-area">
                <input 
                    type="text" 
                    className="chat-message-input" 
                    placeholder={currentUser ? "Type your message..." : "Please log in to chat"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
                    disabled={!currentUser || isLoading}
                />
                <button className="chat-send-message-btn" onClick={() => handleSendMessage(message)} disabled={!currentUser || isLoading}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;