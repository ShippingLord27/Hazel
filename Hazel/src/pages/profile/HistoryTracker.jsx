import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const HistoryTracker = () => {
    const { currentUser } = useApp();
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (currentUser) {
                try {
                    // Fetch purchase history
                    const purchasesQuery = query(collection(db, 'rentals'), where('userId', '==', currentUser.uid));
                    const purchasesSnapshot = await getDocs(purchasesQuery);
                    const purchases = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setPurchaseHistory(purchases);

                    // Fetch chat history
                    const chatsQuery = query(collection(db, 'chats'), where('users', 'array-contains', currentUser.uid));
                    const chatsSnapshot = await getDocs(chatsQuery);
                    const chats = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setChatHistory(chats);
                } catch (error) {
                    console.error("Error fetching history:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchHistory();
    }, [currentUser]);

    if (loading) {
        return <div>Loading history...</div>;
    }

    return (
        <div className="history-tracker">
            <h3>Purchase History</h3>
            {purchaseHistory.length > 0 ? (
                <ul>
                    {purchaseHistory.map(purchase => (
                        <li key={purchase.id}>
                            <p>Item: {purchase.listingName}</p>
                            <p>Status: {purchase.status}</p>
                            <p>Date: {new Date(purchase.startDate).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No purchase history found.</p>
            )}

            <h3>Chat History</h3>
            {chatHistory.length > 0 ? (
                <ul>
                    {chatHistory.map(chat => (
                        <li key={chat.id}>
                            {/* Display chat details here. You might need to fetch the other user's info */}
                            <p>Chat with: {chat.users.find(uid => uid !== currentUser.uid)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No chat history found.</p>
            )}
        </div>
    );
};

export default HistoryTracker;
