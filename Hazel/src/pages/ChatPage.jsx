import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { runChat } from '../gemini';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

const ChatPage = () => {
    const { currentUser } = useApp();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ownerId = queryParams.get('ownerId');
    const renterId = queryParams.get('renterId');
    const listingId = queryParams.get('listingId');

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!ownerId || !renterId || !listingId) return;

        const chatQuery = query(collection(db, 'chats'), 
            where('listingId', '==', listingId), 
            where('users', 'array-contains', currentUser.uid)
        );

        const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const chatDoc = querySnapshot.docs[0];
                setChatId(chatDoc.id);
                const messagesQuery = query(collection(db, `chats/${chatDoc.id}/messages`), orderBy('timestamp'));
                onSnapshot(messagesQuery, (messagesSnapshot) => {
                    const msgs = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMessages(msgs);
                });
            } else {
                const newChatId = `${listingId}_${renterId}`;
                setChatId(newChatId);
            }
        });

        return () => unsubscribe();
    }, [ownerId, renterId, listingId, currentUser.uid]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        const messageData = {
            text: newMessage,
            senderId: currentUser.uid,
            timestamp: serverTimestamp()
        };

        try {
            await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
            setNewMessage('');
            
            // AI response
            const aiResponse = await runChat(newMessage);
            const aiMessageData = {
                text: aiResponse,
                senderId: 'ai',
                timestamp: serverTimestamp()
            };
            await addDoc(collection(db, `chats/${chatId}/messages`), aiMessageData);

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Type your message..." 
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
