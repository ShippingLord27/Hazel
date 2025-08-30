import React, { createContext, useState, useEffect } from 'react';
import { initialProductData, initialSimulatedUsers, initialRentalAgreement, initialRentalHistory, initialOwnerLentHistory } from '../data/initialData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // ... states ...
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [products, setProducts] = useState(initialProductData);
    const [users, setUsers] = useState(initialSimulatedUsers);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState({ id: 'support', name: 'HAZEL Support', context: null });
    const [rentalHistory, setRentalHistory] = useState(initialRentalHistory);
    const [ownerLentHistory, setOwnerLentHistory] = useState(initialOwnerLentHistory);
    const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);

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

    const signup = (userData, role) => { // Role parameter added
        if (users[userData.email]) {
            showToast('Email already registered.');
            return null;
        }
        const newUser = {
            ...userData,
            profilePic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            location: "New Member City, ST",
            myListingIds: [],
            favoriteListingIds: [],
            activeRentalsCount: 0,
            totalEarningsAmount: 0,
            totalListingViews: 0,
            role: role, // Assign the role from the parameter ('user' or 'owner')
            verificationStatus: 'unverified',
            paymentInfo: null
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
        if (!currentUser || currentUser.role !== 'user') { 
            showToast("Only users can have favorites."); 
            return; 
        }
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

    const generateAndPrintReceipt = (orderDetails) => {
        const itemsHtml = orderDetails.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return '';
            return `
                <p>
                    <strong>${product.fullTitle}</strong><br>
                    Duration: ${item.rentalDurationDays} day(s)
                </p>
            `;
        }).join('');

        const receiptContent = `
            <html>
                <head>
                    <title>Rental Receipt - ${orderDetails.transactionId}</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                        h1 { color: #f33f3f; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                        th { background-color: #f2f2f2; }
                        .total { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>HAZEL Rental Receipt</h1>
                    <p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>
                    <p><strong>Date:</strong> ${new Date(orderDetails.date).toLocaleDateString()}</p>
                    <hr>
                    <h3>Rented Item(s)</h3>
                    ${itemsHtml}
                    <table>
                        <tr><td>Rental Cost</td><td>₱${orderDetails.rentalCost.toFixed(2)}</td></tr>
                        <tr><td>Delivery Fee</td><td>₱${orderDetails.deliveryFee.toFixed(2)}</td></tr>
                        <tr><td>Service Fee</td><td>₱${orderDetails.serviceFee.toFixed(2)}</td></tr>
                        <tr class="total"><td>Total Paid</td><td>₱${orderDetails.totalAmount.toFixed(2)}</td></tr>
                    </table>
                    <p style="margin-top: 30px;">Thank you for using HAZEL!</p>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();
    };

    const value = {
        theme, toggleTheme,
        toast, showToast,
        products,
        addProduct, updateProduct, deleteProduct,
        users, currentUser, updateUser, login, logout, signup,
        cart, addToCart, removeFromCart, clearCart,
        rentalAgreementTemplate, setRentalAgreementTemplate,
        toggleFavorite,
        isChatOpen, chatPartner, openChat, closeChat, toggleChat,
        rentalHistory, ownerLentHistory, generateAndPrintReceipt
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};