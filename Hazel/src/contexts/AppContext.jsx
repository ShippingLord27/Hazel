
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, query, where, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebaseClient';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State declarations
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [session, setSession] = useState(null); // This seems unused, but I'll leave it.
    const [currentUser, setCurrentUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [ownerLentHistory, setOwnerLentHistory] = useState([]);
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setIsLoading(true);
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = { uid: user.uid, email: user.email, ...docSnap.data() };
                    setCurrentUser(userData);
                    fetchUserFavorites(user.uid);
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
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [fetchAllProfiles, fetchUserFavorites]);

    const signup = async (userData, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;
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
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().role === role) {
                showToast('Login successful!');
                return { uid: user.uid, ...docSnap.data() };
            } else {
                await signOut(auth);
                showToast(`Incorrect portal or role not found.`);
                return null;
            }
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
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, updatedData, { merge: true });

            if (currentUser && currentUser.uid === userId) {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setCurrentUser({ uid: userId, email: currentUser.email, ...docSnap.data() });
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

    const fetchInitialData = useCallback(async () => {
        setItemsLoading(true);
        // Fetch categories and tags first to map them to items
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
        const categoriesMap = categoriesData.reduce((acc, cat) => ({...acc, [cat.id]: cat.name}), {});

        const tagsSnapshot = await getDocs(collection(db, "tags"));
        const tagsData = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTags(tagsData);
        const tagsMap = tagsData.reduce((acc, tag) => ({...acc, [tag.id]: tag.name}), {});
        
        // Fetch items and enrich them with category and tag names
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
        setItemsLoading(false);
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const addItem = async (itemData) => {
        if (!currentUser) { showToast('You must be logged in to add an item.'); return; }
        try {
            const newItemRef = doc(collection(db, "items"));
            const newItem = {
                ...itemData,
                ownerId: currentUser.uid,
                createdAt: new Date(),
                // Hardcoded for now
                location: "Mandaluyong, Metro Manila", 
                status: "available"
            };
            await setDoc(newItemRef, newItem);
            // Manually re-fetch data to keep the UI in sync
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
            if (!itemDoc.exists() || itemDoc.data().ownerId !== currentUser.uid) {
                showToast("You don't have permission to edit this item.");
                return;
            }
            await setDoc(itemRef, updatedData, { merge: true });
            // Manually re-fetch data to keep the UI in sync
            await fetchInitialData(); 
            showToast('Item updated successfully!');
        } catch (error) {
            showToast(`Error updating item: ${error.message}`);
        }
    };

    const deleteItem = async (itemId) => {
        if (!currentUser || !items.find(i => i.id === itemId && i.ownerId === currentUser.uid)) {
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
            if (isCurrentlyFavorite) {
                // Find and delete the favorite document
                const favQuery = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid), where('itemId', '==', itemId));
                const favSnapshot = await getDocs(favQuery);
                if (!favSnapshot.empty) {
                    const favDocId = favSnapshot.docs[0].id;
                    await deleteDoc(doc(db, 'favorites', favDocId));
                }
            } else {
                // Add a new favorite document.
                const favDoc = doc(collection(db, 'favorites'));
                await setDoc(favDoc, { userId: currentUser.uid, itemId: itemId });
            }
        } catch (error) {
            showToast(`Error updating favorites: ${error.message}`);
            // Revert UI change on error
            setFavorites(favorites);
        }
    };

    // --- Cart Functions ---
    const addToCart = (cartItem) => {
        // Expects a cartItem object with item details and rental options
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

    // --- Other Helper Functions ---
    const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
    const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
    const closeChat = () => setChatOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);
    
    const value = { 
        theme, toggleTheme, toast, showToast, 
        items, categories, tags, itemsLoading,
        session, currentUser, allProfiles, 
        favorites, toggleFavorite,
        login, signup, logout, updateUser, updateUserPassword, 
        addItem, updateItem, deleteItem,
        cart, addToCart, removeFromCart, clearCart, 
        isChatOpen, chatPartner, openChat, closeChat, toggleChat, 
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
