import React, { createContext, useState, useEffect } from 'react';
import { initialProductData, initialSimulatedUsers, initialRentalAgreement } from '../data/initialData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // ... all state declarations remain the same ...
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [products, setProducts] = useState(initialProductData);
    const [users, setUsers] = useState(initialSimulatedUsers);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState({ id: 'support', name: 'HAZEL Support', context: null });
    const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);

    // ... all functions like showToast, login, logout, etc., remain the same ...
    useEffect(() => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const showToast = (message, duration = 3000) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), duration);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const login = (email, password) => {
        const user = users[email];
        if (user && user.password === password) {
            setCurrentUser(JSON.parse(JSON.stringify(user)));
            showToast('Login successful!');
            return user;
        }
        showToast('Invalid email or password.');
        return null;
    };

    const logout = () => {
        setCurrentUser(null);
        setCart([]);
        showToast('You have been logged out.');
        closeChat();
    };

    const signup = (userData) => {
        if (users[userData.email]) {
            showToast('Email already registered.');
            return null;
        }
        const newUser = {
            ...userData,
            profilePic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            location: "New Member City, ST", myListingIds: [], favoriteListingIds: [],
            activeRentalsCount: 0, totalEarningsAmount: 0, totalListingViews: 0,
            isAdmin: false, verificationStatus: 'unverified'
        };
        setUsers(prev => ({ ...prev, [userData.email]: newUser }));
        setCurrentUser(newUser);
        showToast('Account created successfully!');
        return newUser;
    };
    
    const updateUser = (email, updatedData) => {
        setUsers(prevUsers => ({...prevUsers, [email]: {...prevUsers[email], ...updatedData }}));
        if (currentUser && currentUser.email === email) {
            setCurrentUser(prev => ({ ...prev, ...updatedData }));
        }
    };

    const addProduct = (productData) => {
        const newProduct = { ...productData, id: Math.max(0, ...products.map(p => p.id)) + 1, reviews: [] };
        
        setProducts(prev => [...prev, newProduct]);

        setUsers(prevUsers => {
            const owner = prevUsers[newProduct.ownerId];
            if (!owner) return prevUsers;
            const updatedOwner = {
                ...owner,
                myListingIds: [...owner.myListingIds, newProduct.id]
            };
            return { ...prevUsers, [newProduct.ownerId]: updatedOwner };
        });

        if (currentUser && currentUser.email === newProduct.ownerId) {
            setCurrentUser(prevUser => ({
                ...prevUser,
                myListingIds: [...prevUser.myListingIds, newProduct.id]
            }));
        }
    };

    const updateProduct = (updatedProduct) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    
    const deleteProduct = (productId) => {
        const productToDelete = products.find(p => p.id === productId);
        if (!productToDelete) return;

        setProducts(prev => prev.filter(p => p.id !== productId));
        
        setUsers(prevUsers => {
            const owner = prevUsers[productToDelete.ownerId];
            if (!owner) return prevUsers;
            const updatedOwner = {
                ...owner,
                myListingIds: owner.myListingIds.filter(id => id !== productId)
            };
            return { ...prevUsers, [productToDelete.ownerId]: updatedOwner };
        });

        if (currentUser && currentUser.email === productToDelete.ownerId) {
             setCurrentUser(prevUser => ({
                ...prevUser,
                myListingIds: prevUser.myListingIds.filter(id => id !== productId)
            }));
        }

        showToast(`Listing ID: ${productId} has been deleted.`);
    };
    
    const addToCart = (item) => {
        if (!currentUser) { showToast("Please login to add items to your cart."); return false; }
        if (cart.find(cartItem => cartItem.productId === item.productId)) { showToast("This item is already in your cart."); return false; }
        setCart(prev => [...prev, item]);
        showToast("Item added to cart!");
        return true;
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
        showToast("Item removed from cart.");
    };

    const clearCart = () => setCart([]);

    const toggleFavorite = (productId) => {
        if (!currentUser) { showToast("Please login to manage favorites."); return; }
        const isFavorite = currentUser.favoriteListingIds.includes(productId);
        const updatedFavorites = isFavorite
            ? currentUser.favoriteListingIds.filter(id => id !== productId)
            : [...currentUser.favoriteListingIds, productId];
        showToast(isFavorite ? "Removed from favorites." : "Added to favorites.");
        updateUser(currentUser.email, { favoriteListingIds: updatedFavorites });
    };

    const openChat = (partnerDetails) => {
        if (!currentUser) { showToast("Please login to chat."); return; }
        setChatPartner(partnerDetails);
        setChatOpen(true);
    };

    const closeChat = () => setChatOpen(false);

    const toggleChat = () => {
        if (isChatOpen) closeChat();
        else openChat({ id: 'support', name: 'HAZEL Support', context: null });
    };

    // THE KEY CHANGE IS HERE: `getProductById` is removed from the value object.
    const value = {
        theme, toggleTheme,
        toast, showToast,
        products, // We now pass the entire products array
        addProduct, updateProduct, deleteProduct,
        users, currentUser, updateUser, login, logout, signup,
        cart, addToCart, removeFromCart, clearCart,
        rentalAgreementTemplate, setRentalAgreementTemplate,
        toggleFavorite,
        isChatOpen, chatPartner, openChat, closeChat, toggleChat
    };


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};