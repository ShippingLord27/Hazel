import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialRentalHistoryData, initialRentalAgreement } from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State declarations
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [products, setProducts] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [session, setSession] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);
    const [isLoading, setIsLoading] = useState(true);

    // Auth & Profile Management
    useEffect(() => {
        const fetchAllUserProfiles = async () => {
            const { data, error } = await supabase.rpc('get_all_user_profiles');
            if (error) { console.warn("Could not fetch all user profiles. This is expected for non-admin users.", error.message); return []; }
            return data || [];
        };

        const setupAuthAndProfileListener = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) setCurrentUser({ ...profile, email: session.user.email });
                if (profile?.role === 'admin') setAllProfiles(await fetchAllUserProfiles());
            }
            setIsLoading(false);

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                if (session) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    setCurrentUser(profile ? { ...profile, email: session.user.email } : null);
                    if (profile?.role === 'admin') {
                        setAllProfiles(await fetchAllUserProfiles());
                    } else {
                        setAllProfiles([]);
                    }
                } else {
                    setCurrentUser(null);
                    setAllProfiles([]);
                }
            });

            return subscription;
        };

        const subscription = setupAuthAndProfileListener();
        return () => { subscription.then(sub => sub.unsubscribe()); };
    }, []);
    
    // --- SIGNUP FUNCTION (Verified Correct) ---
    const signup = async (userData, role) => {
        const { email, password, firstName, lastName } = userData; // Expects camelCase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName, // Correctly maps to snake_case
                    last_name: lastName,   // Correctly maps to snake_case
                    role: role,
                    profile_pic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`
                }
            }
        });
        if (error) { showToast(error.message); return null; }
        showToast('Account created! Please check your email to verify.');
        return data.user;
    };

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { showToast(error.message); return null; }
        showToast('Login successful!');
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const updateUser = async (userId, updatedData) => {
        const { error } = await supabase.from('profiles').update(updatedData).eq('id', userId);
        if (error) { showToast("Failed to update profile."); console.error("Update user error:", error); return; }

        if (currentUser && currentUser.id === userId) setCurrentUser(prev => ({ ...prev, ...updatedData }));
        if (currentUser && currentUser.role === 'admin') {
            const refreshedProfiles = await supabase.rpc('get_all_user_profiles');
            if (refreshedProfiles.data) setAllProfiles(refreshedProfiles.data);
        }
        showToast("Profile updated successfully!");
    };

    // Other functions (unchanged)
    useEffect(() => {
        setProducts(initialProductData.map(p => ({...p, priceDisplay: `₱${p.price}/day`})));
        setRentalHistory(initialRentalHistoryData);
        setAllTags([...new Set(initialProductData.flatMap(p => p.tags || []))]);
    }, []);
    const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
    const addToCart = (item) => { if (cart.some(cartItem => cartItem.productId === item.productId)) { showToast("This item is already in your cart."); return false; } setCart(prev => [...prev, item]); showToast("Item added to cart!"); return true; };
    const removeFromCart = (productId) => { setCart(prev => prev.filter(item => item.productId !== productId)); showToast("Item removed from cart."); };
    const clearCart = () => setCart([]);
    const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
    const closeChat = () => setChatOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);
    
    const value = { theme, toggleTheme, toast, showToast, products, allTags, session, currentUser, allProfiles, login, signup, logout, updateUser, cart, addToCart, removeFromCart, clearCart, isChatOpen, chatPartner, openChat, closeChat, toggleChat, isLoading };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;