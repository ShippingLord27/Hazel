import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

const ChatListPage = () => {
    const { chatThreads, openChat, users } = useApp();
    const navigate = useNavigate();

    const handleThreadClick = (partner) => {
        openChat(partner);
        // On smaller screens, you might want to navigate to a dedicated chat view
        // For this app, opening the widget is sufficient.
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header">
                <h1>My Conversations</h1>
                <p>Select a conversation to view your chat history.</p>
            </div>
            <div className="chat-thread-list">
                {Object.values(chatThreads).length > 0 ? (
                    Object.values(chatThreads).map(thread => {
                        const partner = users[thread.partnerEmail];
                        if (!partner) return null; // Don't render if partner data isn't loaded yet

                        return (
                            <div key={thread.thread_id} className="chat-thread-item" onClick={() => handleThreadClick(partner)}>
                                <img src={partner.profilePic} alt={partner.firstName} className="chat-thread-avatar" />
                                <div className="chat-thread-info">
                                    <h4>{partner.firstName} {partner.lastName}</h4>
                                    <p>{thread.lastMessage ? thread.lastMessage.content.substring(0, 40) + '...' : 'No messages yet'}</p>
                                </div>
                                {thread.unreadCount > 0 && (
                                    <span className="unread-count-badge">{thread.unreadCount}</span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>You have no active conversations. Start a chat with an item owner to see it here.</p>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;