import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData, initialRentalAgreement } from '../data/initialData';

const AppContext = createContext();

// --- Helper Functions for Data Transformation ---

// Converts a user object from Supabase (flat) to the app's format (nested)
const transformProfileFromDb = (dbProfile) => {
    if (!dbProfile) return null;
    return {
        ...dbProfile,
        // Convert comma-separated string to array of numbers, handle empty/null string
        myListingIds: dbProfile.myListingIds ? dbProfile.myListingIds.split(',').map(Number) : [],
        favoriteListingIds: dbProfile.favoriteListingIds ? dbProfile.favoriteListingIds.split(',').map(Number) : [],
        // Reconstruct the paymentInfo object
        paymentInfo: dbProfile.paymentCardNumber
            ? {
                cardNumber: dbProfile.paymentCardNumber,
                expiryDate: dbProfile.paymentExpiryDate,
                cvv: dbProfile.paymentCvv
            }
            : null
    };
};

// Converts a user object from the app to Supabase's flat format
const transformProfileToDb = (appProfile) => {
    if (!appProfile) return null;
    const dbData = { ...appProfile };

    // Convert arrays to comma-separated strings
    if (Array.isArray(dbData.myListingIds)) {
        dbData.myListingIds = dbData.myListingIds.join(',');
    }
    if (Array.isArray(dbData.favoriteListingIds)) {
        dbData.favoriteListingIds = dbData.favoriteListingIds.join(',');
    }

    // Flatten paymentInfo object
    if (dbData.paymentInfo) {
        dbData.paymentCardNumber = dbData.paymentInfo.cardNumber;
        dbData.paymentExpiryDate = dbData.paymentInfo.expiryDate;
        dbData.paymentCvv = dbData.paymentInfo.cvv;
    } else {
        dbData.paymentCardNumber = null;
        dbData.paymentExpiryDate = null;
        dbData.paymentCvv = null;
    }

    // Remove app-specific keys that don't exist in the DB
    delete dbData.paymentInfo;
    
    return dbData;
};


export const AppProvider = ({ children }) => {
// State Declarations
const [theme, setTheme] = useState(() => {
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-mode', savedTheme === 'dark');
return savedTheme;
});
const [products, setProducts] = useState([]);
const [users, setUsers] = useState({});
const [currentUser, setCurrentUser] = useState(null);
const [cart, setCart] = useState([]);
const [toast, setToast] = useState({ show: false, message: '' });
const [isChatOpen, setChatOpen] = useState(false);
const [chatPartner, setChatPartner] = useState({ id: 'support', name: 'HAZEL Support', context: null });
const [rentalHistory, setRentalHistory] = useState([]);
const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);
const [isLoading, setIsLoading] = useState(true);

// --- DATA FETCHING ---
useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            // Using table names from `testdatasave.jsx`
            const [productsRes, profilesRes, rentalsRes] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('profiles').select('*'),
                supabase.from('rental_history').select('*')
            ]);

            const errors = { products: productsRes.error, profiles: profilesRes.error, rentals: rentalsRes.error };
            if (errors.products || errors.profiles || errors.rentals) {
                throw new Error(JSON.stringify(errors, null, 2));
            }

            if (productsRes.data.length === 0 && profilesRes.data.length === 0) {
                console.warn("Database appears empty. Loading initial local data for development. Please seed your database at /seed-data for persistence.");
                setProducts(initialProductData);
                setUsers(initialSimulatedUsers);
                setRentalHistory(initialRentalHistoryData);
            } else {
                setProducts(productsRes.data);

                // Transform DB profiles to app format before setting state
                const usersObject = profilesRes.data.reduce((acc, user) => {
                    acc[user.email] = transformProfileFromDb(user);
                    return acc;
                }, {});

                setUsers(usersObject);
                setRentalHistory(rentalsRes.data);
            }
        } catch (error) {
             console.error("CRITICAL: Error fetching data from Supabase. This could be due to incorrect .env variables or network issues.", error);
             console.warn("Falling back to local initialData due to Supabase fetch error.");
             setProducts(initialProductData);
             setUsers(initialSimulatedUsers);
             setRentalHistory(initialRentalHistoryData);
        } finally {
            setIsLoading(false);
        }
    };

    fetchInitialData();
}, []);

// --- AUTH FUNCTIONS ---
const login = (email, password) => {
    const user = users[email];
    if (user && user.password === password) {
        setCurrentUser(user);
        showToast('Login successful!');
        return user;
    }
    showToast('Invalid email or password.');
    return null;
};

const signup = async (userData, role) => {
    if (users[userData.email]) {
        showToast('Email already registered.');
        return null;
    }
    const newUser = {
        ...userData,
        profilePic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        location: "New Member City, ST",
        myListingIds: [], // App format
        favoriteListingIds: [], // App format
        activeRentalsCount: 0,
        totalEarningsAmount: 0,
        totalListingViews: 0,
        role: role,
        verificationStatus: 'unverified',
        paymentInfo: null // App format
    };

    // Transform to DB format before inserting
    const dbUser = transformProfileToDb(newUser);
    const { data, error } = await supabase.from('profiles').insert(dbUser).select().single();

    if (error) {
        showToast("Signup failed. Please try again.");
        console.error(error);
        return null;
    }

    // Transform back to app format after receiving from DB
    const appFormattedUser = transformProfileFromDb(data);
    setUsers(prev => ({ ...prev, [appFormattedUser.email]: appFormattedUser }));
    setCurrentUser(appFormattedUser);
    showToast('Account created successfully!');
    return appFormattedUser;
};

const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
};

const updateUser = async (email, updatedData) => {
    // Transform data to DB format before updating
    const dbUpdateData = transformProfileToDb(updatedData);

    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdateData)
        .eq('email', email)
        .select()
        .single();

    if (error) {
        showToast("Failed to update user profile.");
        console.error("Update user error:", error);
        return;
    }
    
    // Transform back to app format for state consistency
    const appFormattedUser = transformProfileFromDb(data);
    setUsers(prev => ({ ...prev, [email]: appFormattedUser }));
    if (currentUser && currentUser.email === email) {
        setCurrentUser(appFormattedUser);
    }
};

// --- PRODUCT FUNCTIONS ---
const addProduct = async (productData) => {
    const { data, error } = await supabase.from('products').insert(productData).select().single();
    if (error) {
        showToast("Failed to create listing.");
        console.error("Add product error:", error);
        return;
    }
    setProducts(prev => [...prev, data]);
    const owner = users[data.ownerId];
    if (owner) {
        // updateUser handles the array -> string transformation internally
        await updateUser(owner.email, {
            myListingIds: [...(owner.myListingIds || []), data.id]
        });
    }
};

const updateProduct = async (updatedProduct) => {
    const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', updatedProduct.id)
        .select()
        .single();
        
    if (error) { showToast("Failed to update listing."); console.error(error); return; }
    
    setProducts(prev => prev.map(p => p.id === data.id ? data : p));
};

const deleteProduct = async (productId) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;
    
    const { error } = await supabase.from('products').delete().eq('id', productId);
    
    if (error) { showToast("Failed to delete listing."); console.error(error); return; }

    setProducts(prev => prev.filter(p => p.id !== productId));
    
    const owner = users[productToDelete.ownerId];
    if (owner) {
        // updateUser handles the array -> string transformation internally
        await updateUser(owner.email, {
            myListingIds: owner.myListingIds.filter(id => id !== productId)
        });
    }

    showToast(`Listing has been deleted.`);
};

// --- RENTAL FUNCTIONS ---
const addRentalRecord = async (orderDetails) => {
    const rentalRecords = orderDetails.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const serviceFeePerItem = orderDetails.items.length > 0 ? orderDetails.serviceFee / orderDetails.items.length : 0;
        return {
            transactionId: orderDetails.transactionId,
            productId: item.productId,
            renterEmail: currentUser.email,
            renterName: `${currentUser.firstName} ${currentUser.lastName}`,
            ownerEmail: product.ownerId,
            rentalStartDate: item.rentalStartDate,
            rentalDurationDays: item.rentalDurationDays,
            rentalTotalCost: item.rentalTotalCost,
            deliveryFee: item.deliveryFee,
            serviceFee: serviceFeePerItem,
            totalAmount: item.rentalTotalCost + item.deliveryFee + serviceFeePerItem,
            status: 'Completed' 
        };
    });

    const { data, error } = await supabase.from('rental_history').insert(rentalRecords).select();

    if (error) {
        showToast("Failed to record rental history.");
        console.error("Add rental history error:", error);
        return;
    }

    setRentalHistory(prev => [...prev, ...data]);
};


// --- OTHER FUNCTIONS ---
const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
};

const showToast = (message, duration = 3000) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), duration);
};

const addToCart = (item) => {
    if (cart.some(cartItem => cartItem.productId === item.productId)) {
        showToast("This item is already in your cart.");
        return false;
    }
    setCart(prev => [...prev, item]);
    showToast("Item added to cart!");
    return true;
};

const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    showToast("Item removed from cart.");
};

const clearCart = () => setCart([]);

const openChat = (partnerDetails) => {
    setChatPartner(partnerDetails);
    setChatOpen(true);
};

const closeChat = () => setChatOpen(false);

const toggleChat = () => setChatOpen(prev => !prev);

const generateAndPrintReceipt = (orderDetails) => {
    const receiptWindow = window.open('', 'PRINT', 'height=600,width=800');
    const itemsHtml = orderDetails.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `<tr><td>${product?.title || 'N/A'}</td><td>${item.rentalDurationDays} day(s)</td><td>₱${item.rentalTotalCost.toFixed(2)}</td></tr>`;
    }).join('');

    receiptWindow.document.write('<html><head><title>Hazel Receipt</title>');
    receiptWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} h1,h2{text-align:center;}</style>');
    receiptWindow.document.write('</head><body>');
    receiptWindow.document.write('<h1>HAZEL Rental Receipt</h1>');
    receiptWindow.document.write(`<p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>`);
    receiptWindow.document.write(`<p><strong>Date:</strong> ${new Date(orderDetails.date).toLocaleString()}</p>`);
    receiptWindow.document.write('<h2>Rented Items</h2>');
    receiptWindow.document.write(`<table><thead><tr><th>Item</th><th>Duration</th><th>Cost</th></tr></thead><tbody>${itemsHtml}</tbody></table>`);
    receiptWindow.document.write('<h2>Summary</h2>');
    receiptWindow.document.write(`<p><strong>Subtotal:</strong> ₱${orderDetails.rentalCost.toFixed(2)}</p>`);
    receiptWindow.document.write(`<p><strong>Service Fee:</strong> ₱${orderDetails.serviceFee.toFixed(2)}</p>`);
    receiptWindow.document.write(`<p><strong>Total Paid:</strong> ₱${orderDetails.totalAmount.toFixed(2)}</p>`);
    receiptWindow.document.write('</body></html>');
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
    receiptWindow.close();
};

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
    // updateUser handles the array -> string transformation internally
    updateUser(currentUser.email, { favoriteListingIds: updatedFavorites });
};

const value = {
    theme, toggleTheme,
    toast, showToast,
    products,
    addProduct, updateProduct, deleteProduct,
    users, currentUser, updateUser, login, logout, signup,
    cart, addToCart, removeFromCart, clearCart,
    rentalAgreementTemplate, setRentalAgreementTemplate,
    addRentalRecord,
    toggleFavorite,
    isChatOpen, chatPartner, openChat, closeChat, toggleChat,
    rentalHistory: rentalHistory.filter(r => r.renterEmail === currentUser?.email),
    ownerLentHistory: rentalHistory.filter(r => r.ownerEmail === currentUser?.email),
    generateAndPrintReceipt
};

return (
    <AppContext.Provider value={value}>
        {isLoading ? <div style={{paddingTop: '200px', textAlign: 'center'}}><h1>Loading Hazel...</h1></div> : children}
    </AppContext.Provider>
);
};

export default AppContext;