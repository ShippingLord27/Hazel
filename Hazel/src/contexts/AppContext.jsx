import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { initialProductData } from '../data/initialData';

export const AppContext = createContext(null);

// Helper function to get a user's full profile from the database view
const getFullUserProfile = async (user) => {
    if (!user) return null;
    const { data: profile } = await supabase.from('user_profiles_view').select('*').eq('user_id', user.id).single();
    return profile ? { ...user, profile } : null;
};

export const AppProvider = ({ children }) => {
    // State
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isLoading, setIsLoading] = useState(true);

    // Auth Listener & Data Fetcher
    useEffect(() => {
        const setupAuthListener = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = await getFullUserProfile(session?.user);
            if (user) {
                setCurrentUser(user);
                if (user.profile.role === 'admin') {
                    const { data: allUsersData } = await supabase.from('user_profiles_view').select('*');
                    setAllProfiles(allUsersData || []);
                }
            }
            setIsLoading(false);
            
            // This listener is now the single source of truth for state changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
                const user = await getFullUserProfile(newSession?.user);
                setCurrentUser(user);
                
                if (user && user.profile.role === 'admin') {
                    const { data: allUsersData } = await supabase.from('user_profiles_view').select('*');
                    setAllProfiles(allUsersData || []);
                } else {
                    // If user is not admin or is logged out, clear the admin-only data
                    setAllProfiles([]);
                }
            });
            return subscription;
        };

        const subscription = setupAuthListener();
        setProducts(initialProductData.map(p => ({...p, priceDisplay: `₱${p.price}/day`})));
        return () => { subscription.then(sub => sub.unsubscribe()); };
    }, []);

    // --- AUTH FUNCTIONS ---
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { showToast(error.message); return null; }
        // The listener will handle setting the user state.
        // We just return the profile for the modal's role-check logic.
        return await getFullUserProfile(data.user);
    };
    
    // --- THE FIX: Simplified logout function ---
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast("Logout failed.", "error");
        } else {
            showToast('Logged out successfully.');
        }
        // The onAuthStateChange listener will automatically set currentUser to null.
    };

    const signup = async (userData, role) => {
        const signUpRole = role === 'user' ? 'renter' : role;
        const { email, password, firstName, lastName } = userData;
        const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { data: { first_name: firstName, last_name: lastName, role: signUpRole } }
        });
        if (error) showToast(error.message);
        else showToast('Account created! Please check your email for verification.');
        return data.user;
    };

    const updateUser = async (userId, role, updatedData) => { /* ... unchanged ... */ };

    // --- OTHER FUNCTIONS ---
    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
    const value = { theme, products, currentUser, allProfiles, isLoading, toast, cart, login, signup, logout, showToast, updateUser };

    return (
        <AppContext.Provider value={value}>
            {!isLoading ? children : <div style={{paddingTop: '200px', textAlign: 'center'}}><h1>Loading Hazel...</h1></div>}
        </AppContext.Provider>
    );
};