
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, query, where, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebaseClient';
import { sampleUsers, sampleCategories, sampleTags, sampleItems, sampleFavorites, sampleChatThreads, sampleChatMessages, sampleTransactions } from '../sampleData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [ownerLentHistory, setOwnerLentHistory] = useState([]);
    const [chatThreads, setChatThreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(true);

    const fetchAllProfiles = useCallback(async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProfiles(profiles);
    }, []);

    const fetchUserFavorites = useCallback(async (userId) => {
        if (!userId) return;
        const favoritesQuery = query(collection(db, "favorites"), where("userId", "==", userId));
        const querySnapshot = await getDocs(favoritesQuery);
        const userFavorites = querySnapshot.docs.map(doc => doc.data().itemId);
        setFavorites(userFavorites);
    }, []);
    
    const fetchUserHistory = useCallback(async (userId) => {
        if (!userId) return;
        const rentalsQuery = query(collection(db, "transactions"), where("renterId", "==", userId));
        const rentalsSnapshot = await getDocs(rentalsQuery);
        const rentals = rentalsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setRentalHistory(rentals);

        const ownedItemsSnapshot = await getDocs(query(collection(db, "items"), where("ownerId", "==", userId)));
        const ownedItemIds = ownedItemsSnapshot.docs.map(doc => doc.id);
        if(ownedItemIds.length > 0) {
            const lentQuery = query(collection(db, "transactions"), where("itemId", "in", ownedItemIds));
            const lentSnapshot = await getDocs(lentQuery);
            const lent = lentSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setOwnerLentHistory(lent);
        }
    }, []);
    
    const fetchUserChats = useCallback(async (userId) => {
        if (!userId) return;
        const threadsQuery = query(collection(db, "chat_threads"), where("participants", "array-contains", userId));
        const threadsSnapshot = await getDocs(threadsQuery);
        const threads = threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatThreads(threads);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setIsLoading(true);
            if (user) {
                let userDoc, userDocId, userDocData;

                // Try fetching by UID first
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    userDoc = docSnap;
                    userDocId = user.uid;
                    userDocData = userDoc.data();
                } else {
                    // If not found, fall back to email query
                    const usersQuery = query(collection(db, "users"), where("email", "==", user.email));
                    const querySnapshot = await getDocs(usersQuery);
                    if (!querySnapshot.empty) {
                        userDoc = querySnapshot.docs[0];
                        userDocId = userDoc.id;
                        userDocData = userDoc.data();
                    }
                }

                if (userDocData) {
                    const userData = { uid: user.uid, id: userDocId, email: user.email, ...userDocData };
                    setCurrentUser(userData);
                    fetchUserFavorites(userDocId);
                    fetchUserHistory(userDocId);
                    fetchUserChats(userDocId);
                    if (userData.role === 'admin') {
                        fetchAllProfiles();
                    }
                } else {
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
                setAllProfiles([]);
                setFavorites([]);
                setRentalHistory([]);
                setOwnerLentHistory([]);
                setChatThreads([]);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [fetchAllProfiles, fetchUserFavorites, fetchUserHistory, fetchUserChats]);

    const fetchInitialData = useCallback(async () => {
        setItemsLoading(true);
        try {
            const categoriesSnapshot = await getDocs(collection(db, "categories"));
            const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesData);
            const categoriesMap = categoriesData.reduce((acc, cat) => ({...acc, [cat.id]: cat.name}), {});

            const tagsSnapshot = await getDocs(collection(db, "tags"));
            const tagsData = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTags(tagsData);
            const tagsMap = tagsData.reduce((acc, tag) => ({...acc, [tag.id]: tag.name}), {});
            
            const itemsSnapshot = await getDocs(collection(db, "items"));
            const itemsData = itemsSnapshot.docs.map(doc => {
                const item = { ...doc.data(), id: doc.id };
                return {
                    ...item,
                    category: categoriesMap[item.categoryId] || 'Uncategorized',
                    tags: item.tags ? item.tags.map(tagId => tagsMap[tagId]).filter(Boolean) : []
                };
            });
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching initial data:", error);
            showToast("Failed to load store data.");
        }
        setItemsLoading(false);
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const signup = async (userData, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;
            // Use Firebase UID as the document ID for new users
            await setDoc(doc(db, "users", user.uid), {
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: role,
                email: userData.email,
                verification_status: 'unverified',
                profile_pic_url: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
                member_since: new Date()
            });
            showToast('Account created successfully!');
            return user;
        } catch (error) {
            showToast(error.message);
            return null;
        }
    };

    const login = async (email, password, role) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // This will be handled by the onAuthStateChanged listener
            // which now has the robust checking logic.
            return user;
        } catch (error) {
            showToast(error.message);
            return null;
        }
    };

    const logout = async () => {
        await signOut(auth);
        showToast("Logged out.");
    };

    const updateUser = async (userId, updatedData) => {
        try {
            // Here, userId should be the document ID (`currentUser.id`)
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, updatedData, { merge: true });

            if (currentUser && currentUser.id === userId) {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                     // Create a new object for the state update
                    setCurrentUser(prevUser => ({...prevUser, ...docSnap.data()}));
                }
            }
            showToast("Profile updated successfully!");
        } catch (error) {
            showToast(`Failed to update profile: ${error.message}`);
        }
    };
    
    const updateUserPassword = async (newPassword) => {
        if (!auth.currentUser) {
            showToast("You must be logged in to update your password.");
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            showToast("Password updated successfully!");
        } catch (error) {
            showToast(`Password update failed: ${error.message}. You may need to log in again to update your password.`);
        }
    };

    const updateUserStatus = async (userId, status) => {
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, { verification_status: status }, { merge: true });
            fetchAllProfiles();
            showToast(`User status updated to ${status}.`);
        } catch (error) {
            showToast(`Error updating user status: ${error.message}`);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            fetchAllProfiles();
            showToast("User deleted successfully.");
        } catch (error) {
            showToast(`Error deleting user: ${error.message}`);
        }
    };

    const addItem = async (itemData) => {
        if (!currentUser) { showToast('You must be logged in to add an item.'); return; }
        try {
            const newItemRef = doc(collection(db, "items"));
            const newItem = {
                ...itemData,
                ownerId: currentUser.id, // Use the document ID for relationships
                createdAt: new Date(),
                location: "Mandaluyong, Metro Manila", 
                status: "available"
            };
            await setDoc(newItemRef, newItem);
            await fetchInitialData(); 
            showToast('Item added successfully!');
        } catch (error) {
            showToast(`Error adding item: ${error.message}`);
        }
    };
    
    const updateItem = async (itemId, updatedData) => {
        if (!currentUser) { showToast('You must be logged in to update an item.'); return; }
        const itemRef = doc(db, "items", itemId);
        try {
            const itemDoc = await getDoc(itemRef);
            if (!itemDoc.exists() || itemDoc.data().ownerId !== currentUser.id) { // Check against document ID
                showToast("You don't have permission to edit this item.");
                return;
            }
            await setDoc(itemRef, updatedData, { merge: true });
            await fetchInitialData(); 
            showToast('Item updated successfully!');
        } catch (error) {
            showToast(`Error updating item: ${error.message}`);
        }
    };

    const updateItemStatus = async (itemId, status) => {
        try {
            const itemRef = doc(db, "items", itemId);
            await setDoc(itemRef, { status: status }, { merge: true });
            fetchInitialData();
            showToast(`Item status updated to ${status}.`);
        } catch (error) {
            showToast(`Error updating item status: ${error.message}`);
        }
    };

    const deleteItem = async (itemId) => {
        if (!currentUser || !items.find(i => i.id === itemId && i.ownerId === currentUser.id)) { // Check against document ID
            showToast("You don't have permission to delete this item.");
            return;
        }
    
        try {
            await deleteDoc(doc(db, "items", itemId));
            const favQuery = query(collection(db, 'favorites'), where('itemId', '==', itemId));
            const favSnapshot = await getDocs(favQuery);
            const batch = writeBatch(db);
            favSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
    
            setItems(prev => prev.filter(item => item.id !== itemId));
            setFavorites(prev => prev.filter(favId => favId !== itemId));
    
            showToast("Listing deleted successfully.");
        } catch (error) {
            showToast(`Error deleting listing: ${error.message}`);
        }
    };

    const toggleFavorite = async (itemId) => {
        if (!currentUser) {
            showToast("Please log in to favorite items.");
            return;
        }

        const isCurrentlyFavorite = favorites.includes(itemId);
        const newFavorites = isCurrentlyFavorite ? favorites.filter(id => id !== itemId) : [...favorites, itemId];
        setFavorites(newFavorites);

        try {
            const favRef = doc(db, "favorites", `${currentUser.id}_${itemId}`); // Use document ID
            if (isCurrentlyFavorite) {
                await deleteDoc(favRef);
            } else {
                await setDoc(favRef, { userId: currentUser.id, itemId: itemId }); // Use document ID
            }
        } catch (error) {
            showToast(`Error updating favorites: ${error.message}`);
            setFavorites(favorites);
        }
    };

    const addToCart = (cartItem) => {
        if (cart.some(item => item.itemId === cartItem.itemId)) {
            showToast("This item is already in your cart.");
            return false;
        }
        setCart(prev => [...prev, cartItem]);
        showToast("Item added to cart!");
        return true;
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.itemId !== itemId));
        showToast("Item removed from cart.");
    };

    const clearCart = () => setCart([]);

    const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
    const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
    const closeChat = () => setChatOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);
    
    const value = { 
        theme, toggleTheme, toast, showToast, 
        items, categories, tags, itemsLoading,
        currentUser, allProfiles, 
        favorites, toggleFavorite,
        login, signup, logout, updateUser, updateUserPassword, updateUserStatus, deleteUser,
        addItem, updateItem, deleteItem, updateItemStatus,
        cart, addToCart, removeFromCart, clearCart, 
        isChatOpen, chatPartner, openChat, closeChat, toggleChat, chatThreads,
        isLoading, 
        rentalHistory, ownerLentHistory, 
        fetchAllProfiles 
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
