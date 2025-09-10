import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 
// import firebaseApp from '../firebase-config'; // Assuming you have this file

import { initialProductData, initialRentalAgreement } from '../data/initialData';

export const AppContext = createContext();

// const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);

export const AppProvider = ({ children }) => {
    // State declarations
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [products, setProducts] = useState(initialProductData);
    const [allTags, setAllTags] = useState([]);
    const [session, setSession] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [ownerLentHistory, setOwnerLentHistory] = useState([]);
    const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);
    const [isLoading, setIsLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        // Mockup of an auth listener
        // onAuthStateChanged(auth, async (user) => {
        //     if (user) {
        //         const docRef = doc(db, "users", user.uid);
        //         const docSnap = await getDoc(docRef);
        //         if (docSnap.exists()) {
        //             setCurrentUser({ uid: user.uid, email: user.email, ...docSnap.data() });
        //         } else {
        //             // Handle case where user exists in auth but not in firestore
        //         }
        //     } else {
        //         setCurrentUser(null);
        //     }
        //     setIsLoading(false);
        // });
        setIsLoading(false);
        setProductsLoading(false);
    }, []);

    const signup = async (userData, role) => {
        console.log("Signup with Firebase would happen here", { userData, role });
        showToast('Signup functionality not yet implemented with Firebase.');
        // try {
        //     const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        //     const user = userCredential.user;
        //     await setDoc(doc(db, "users", user.uid), {
        //         firstName: userData.firstName,
        //         lastName: userData.lastName,
        //         role: role,
        //         profile_pic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`
        //     });
        //     showToast('Account created! Please check your email to verify.');
        //     return user;
        // } catch (error) {
        //     showToast(error.message);
        //     return null;
        // }
    };

    const login = async (email, password, role) => {
        console.log("Login with Firebase would happen here", { email, password, role });
        showToast('Login functionality not yet implemented with Firebase.');

        // try {
        //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //     const user = userCredential.user;

        //     const docRef = doc(db, "users", user.uid);
        //     const docSnap = await getDoc(docRef);

        //     if (docSnap.exists() && docSnap.data().role === role) {
        //         showToast('Login successful!');
        //         return { uid: user.uid, ...docSnap.data() };
        //     } else {
        //         await signOut(auth);
        //         showToast(`Incorrect portal or role not found.`);
        //         return null;
        //     }

        // } catch (error) {
        //     showToast(error.message);
        //     return null;
        // }
    };

    const logout = async () => {
        // await signOut(auth);
        showToast("Logged out.");
    };

    const updateUser = async (userId, updatedData) => {
        console.log("Update with Firebase would happen here", { userId, updatedData });
        showToast('Update functionality not yet implemented with Firebase.');

        // try {
        //     const userRef = doc(db, "users", userId);
        //     await setDoc(userRef, updatedData, { merge: true });
        //     showToast("Profile updated successfully!");
        // } catch (error) {
        //     showToast("Failed to update profile.");
        // }
    };

    const fetchProducts = useCallback(async () => {
        // This will need to be adapted to fetch from Firestore
        setProducts(initialProductData); // Using initial data for now
        setProductsLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
    const addToCart = (item) => { if (cart.some(cartItem => cartItem.productId === item.productId)) { showToast("This item is already in your cart."); return false; } setCart(prev => [...prev, item]); showToast("Item added to cart!"); return true; };
    const removeFromCart = (productId) => { setCart(prev => prev.filter(item => item.productId !== productId)); showToast("Item removed from cart."); };
    const clearCart = () => setCart([]);
    const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
    const closeChat = () => setChatOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);
    
    const value = { theme, toggleTheme, toast, showToast, products, allTags, session, currentUser, allProfiles, login, signup, logout, updateUser, cart, addToCart, removeFromCart, clearCart, isChatOpen, chatPartner, openChat, closeChat, toggleChat, isLoading, productsLoading, rentalHistory, ownerLentHistory };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;