import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { initialProductData, initialSimulatedUsers, initialRentalHistoryData, initialRentalAgreement } from '../data/initialData';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
// ... (State Declarations) ...
const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
const [products, setProducts] = useState([]);
const [allTags, setAllTags] = useState([]);
const [users, setUsers] = useState({});
const [currentUser, setCurrentUser] = useState(null);
const [cart, setCart] = useState([]);
const [toast, setToast] = useState({ show: false, message: '' });
const [isChatOpen, setChatOpen] = useState(false);
const [chatPartner, setChatPartner] = useState({ id: 'support', name: 'HAZEL Support', context: null });
const [rentalHistory, setRentalHistory] = useState([]);
const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);
const [isLoading, setIsLoading] = useState(true);

// --- Data Transformation Logic ---
const transformUserForApp = (userFromDb) => { if (!userFromDb) return null; const appUser = { email: userFromDb.email, password: userFromDb.password, role: userFromDb.role, location: userFromDb.location, firstName: userFromDb.firstname, lastName: userFromDb.lastname, profilePic: userFromDb.profilepic, memberSince: userFromDb.membersince, activeRentalsCount: userFromDb.activerentalscount, totalEarningsAmount: userFromDb.totalearningsamount, totalListingViews: userFromDb.totallistingviews, verificationStatus: userFromDb.verificationstatus, myListingIds: userFromDb.mylistingids ? String(userFromDb.mylistingids).split(',').map(Number) : [], favoriteListingIds: userFromDb.favoritelistingids ? String(userFromDb.favoritelistingids).split(',').map(Number) : [], paymentInfo: null, }; if (userFromDb.paymentcardnumber) { appUser.paymentInfo = { cardNumber: userFromDb.paymentcardnumber, expiryDate: userFromDb.paymentexpirydate, cvv: userFromDb.paymentcvv }; } return appUser; };
const transformProductForApp = (productFromDb, tags, productTags) => {
    if (!productFromDb) return null;
    const relatedTagIds = productTags.filter(pt => pt.product_id === productFromDb.id).map(pt => pt.tag_id);
    const productTagsArray = tags.filter(t => relatedTagIds.includes(t.id)).map(t => t.name);
    return {
        id: productFromDb.id, title: productFromDb.title, fullTitle: productFromDb.fulltitle, category: productFromDb.category,
        price: productFromDb.price, priceDisplay: `₱${productFromDb.price}/day`, image: productFromDb.image,
        description: productFromDb.description, ownerId: productFromDb.ownerid, ownerName: productFromDb.ownername,
        trackingTagId: productFromDb.trackingtagid, ownerTerms: productFromDb.ownerterms, status: productFromDb.status,
        reviews: productFromDb.reviews || [], tags: productTagsArray
    };
};
const transformProductForDb = (productFromApp) => { return { id: productFromApp.id, title: productFromApp.title, fulltitle: productFromApp.fullTitle, category: productFromApp.category, price: productFromApp.price, image: productFromApp.image, description: productFromApp.description, ownerid: productFromApp.ownerId, ownername: productFromApp.ownerName, trackingtagid: productFromApp.trackingTagId, ownerterms: productFromApp.ownerTerms, status: productFromApp.status, }; };
const transformRentalForApp = (rentalFromDb) => { if (!rentalFromDb) return null; return { transactionId: rentalFromDb.transactionid, productId: rentalFromDb.productid, renterEmail: rentalFromDb.renteremail, renterName: rentalFromDb.rentername, ownerEmail: rentalFromDb.owneremail, rentalStartDate: rentalFromDb.rentalstartdate, rentalDurationDays: rentalFromDb.rentaldurationdays, rentalTotalCost: rentalFromDb.rentaltotalcost, deliveryFee: rentalFromDb.deliveryfee, serviceFee: rentalFromDb.servicefee, totalAmount: rentalFromDb.totalamount, status: rentalFromDb.status, }; };

// --- DATA FETCHING ---
useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [productsRes, profilesRes, rentalsRes, tagsRes, productTagsRes] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('profiles').select('*'), 
                supabase.from('rental_history').select('*'),
                supabase.from('tags').select('*'),
                supabase.from('product_tags').select('*')
            ]);

            if (productsRes.error || profilesRes.error || rentalsRes.error || tagsRes.error || productTagsRes.error) {
                throw new Error(`Supabase error`);
            }
            
            const tagsData = tagsRes.data || [];
            const productTagsData = productTagsRes.data || [];
            setAllTags(tagsData.map(t => t.name));

            const transformedProducts = (productsRes.data || []).map(p => transformProductForApp(p, tagsData, productTagsData));
            setProducts(transformedProducts);
            
            const transformedRentals = (rentalsRes.data || []).map(transformRentalForApp);
            setRentalHistory(transformedRentals);

            const usersObject = (profilesRes.data || []).reduce((acc, user) => { acc[user.email] = transformUserForApp(user); return acc; }, {});
            setUsers(usersObject);

        } catch (error) {
             console.error("CRITICAL: Error fetching data from Supabase. Falling back to local data.", error);
             setProducts(initialProductData.map(p => ({...p, priceDisplay: `₱${p.price}/day`})));
             setUsers(initialSimulatedUsers);
             setRentalHistory(initialRentalHistoryData);
             setAllTags([...new Set(initialProductData.flatMap(p => p.tags))]); // Get unique tags from local data
        } finally {
            setIsLoading(false);
        }
    };

    fetchInitialData();
}, []);

// --- AUTH FUNCTIONS (Unchanged) ---
const login = (email, password) => { const user = users[email]; if (user && user.password === password) { setCurrentUser(user); showToast('Login successful!'); return user; } showToast('Invalid email or password.'); return null; };
const signup = async (userData, role) => {
    if (users[userData.email]) { showToast('Email already registered.'); return null; }
    const newUserForDb = { firstname: userData.firstName, lastname: userData.lastName, email: userData.email, password: userData.password, profilepic: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`, membersince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), location: "New Member City, ST", mylistingids: "", favoritelistingids: "", activerentalscount: 0, totalearningsamount: 0, totallistingviews: 0, role: role, verificationstatus: 'unverified' };
    const { data: dbUser, error } = await supabase.from('profiles').insert(newUserForDb).select().single();
    if (error) { showToast("Signup failed. Please try again."); console.error(error); return null; }
    const appReadyUser = transformUserForApp(dbUser);
    setUsers(prev => ({ ...prev, [appReadyUser.email]: appReadyUser }));
    setCurrentUser(appReadyUser);
    showToast('Account created successfully!');
    return appReadyUser;
};
const logout = () => { setCurrentUser(null); showToast('Logged out successfully.'); };
const updateUser = async (originalEmail, updatedData) => {
    const dbReadyData = {};
    for (const key in updatedData) { if (key === 'myListingIds') { dbReadyData['mylistingids'] = updatedData[key].join(','); } else if (key === 'favoriteListingIds') { dbReadyData['favoritelistingids'] = updatedData[key].join(','); } else if (key === 'paymentInfo') { if (updatedData.paymentInfo) { dbReadyData['paymentcardnumber'] = updatedData.paymentInfo.cardNumber; dbReadyData['paymentexpirydate'] = updatedData.paymentInfo.expiryDate; dbReadyData['paymentcvv'] = updatedData.paymentInfo.cvv; } } else { dbReadyData[key.toLowerCase()] = updatedData[key]; } }
    const { data: updatedDbUser, error } = await supabase.from('profiles').update(dbReadyData).eq('email', originalEmail).select().single();
    if (error) { showToast("Failed to update user profile."); console.error("Update user error:", error); return; }
    const appReadyUser = transformUserForApp(updatedDbUser);
    setUsers(prev => { const newUsersState = { ...prev }; if (originalEmail !== appReadyUser.email) { delete newUsersState[originalEmail]; } newUsersState[appReadyUser.email] = appReadyUser; return newUsersState; });
    if (currentUser && currentUser.email === originalEmail) { setCurrentUser(appReadyUser); }
};

// --- PRODUCT FUNCTIONS (Unchanged, tags are not editable for now) ---
const addProduct = async (productDataFromModal) => { const newProductForApp = { ...productDataFromModal, ownerId: currentUser.email, ownerName: `${currentUser.firstName} ${currentUser.lastName}`, status: 'pending' }; const dbReadyProduct = transformProductForDb(newProductForApp); delete dbReadyProduct.id; const { data, error } = await supabase.from('products').insert(dbReadyProduct).select().single(); if (error) { showToast("Failed to create listing. Please check console for details."); console.error("Add product error:", error); return; } const appReadyProduct = transformProductForApp(data, allTags.map(name => ({id: name, name})), []); setProducts(prev => [...prev, appReadyProduct]); const owner = users[appReadyProduct.ownerId]; if (owner) { const updatedListingIds = [...owner.myListingIds, appReadyProduct.id]; await updateUser(owner.email, { myListingIds: updatedListingIds }); } showToast("Listing submitted for admin approval!"); };
const updateProduct = async (updatedProduct) => { const dbReadyProduct = transformProductForDb(updatedProduct); const { data, error } = await supabase.from('products').update(dbReadyProduct).eq('id', updatedProduct.id).select().single(); if (error) { showToast("Failed to update listing."); console.error(error); return; } const appReadyProduct = transformProductForApp(data, allTags.map(name => ({id: name, name})), []); setProducts(prev => prev.map(p => p.id === appReadyProduct.id ? { ...appReadyProduct, tags: p.tags } : p)); };
const deleteProduct = async (productId) => { const productToDelete = products.find(p => p.id === productId); if (!productToDelete) return; const { error } = await supabase.from('products').delete().eq('id', productId); if (error) { showToast("Failed to delete listing."); console.error(error); return; } setProducts(prev => prev.filter(p => p.id !== productId)); const owner = users[productToDelete.ownerId]; if (owner) { const updatedListingIds = owner.myListingIds.filter(id => id !== productId); await updateUser(owner.email, { myListingIds: updatedListingIds }); } showToast(`Listing has been deleted.`); };
const updateProductStatus = async (productId, newStatus) => { const { data, error } = await supabase.from('products').update({ status: newStatus }).eq('id', productId).select().single(); if (error) { showToast("Failed to update listing status."); console.error(error); return; } const appReadyProduct = transformProductForApp(data, allTags.map(name => ({id: name, name})), []); setProducts(prev => prev.map(p => (p.id === productId ? { ...appReadyProduct, tags: p.tags } : p))); showToast(`Listing status updated to ${newStatus}.`); };

// --- RENTAL FUNCTIONS (Unchanged) ---
const addRentalRecord = async (orderDetails) => { const rentalRecordsForDb = orderDetails.items.map(item => { return { transactionid: `${orderDetails.transactionId}-${item.productId}`, productid: item.productId, renteremail: currentUser.email, rentername: `${currentUser.firstName} ${currentUser.lastName}`, owneremail: products.find(p => p.id === item.productId).ownerId, rentalstartdate: item.rentalStartDate, rentaldurationdays: item.rentalDurationDays, rentaltotalcost: item.rentalTotalCost, deliveryfee: item.deliveryFee, servicefee: (orderDetails.rentalCost * 0.05) / orderDetails.items.length, totalamount: item.rentalTotalCost + item.deliveryFee + ((orderDetails.rentalCost * 0.05) / orderDetails.items.length), status: 'Active' }; }); const { data, error } = await supabase.from('rental_history').insert(rentalRecordsForDb).select(); if (error) { showToast("Failed to record rental history."); console.error("Add rental history error:", error); return; } const transformedNewRentals = data.map(transformRentalForApp); setRentalHistory(prev => [...prev, ...transformedNewRentals]); const renter = users[currentUser.email]; await updateUser(renter.email, { activeRentalsCount: (renter.activeRentalsCount || 0) + rentalRecordsForDb.length }); for (const record of transformedNewRentals) { const owner = users[record.ownerEmail]; if (owner) { await updateUser(owner.email, { activeRentalsCount: (owner.activeRentalsCount || 0) + 1 }); } } };
const updateRentalStatus = async (transactionId, newStatus) => { const rentalToUpdate = rentalHistory.find(r => r.transactionId === transactionId); if (!rentalToUpdate) { showToast("Could not find rental record.", "error"); return; } const { data, error } = await supabase.from('rental_history').update({ status: newStatus }).eq('transactionid', transactionId).select().single(); if (error) { showToast("Failed to update rental status."); console.error("Update rental status error:", error); return; } const updatedRental = transformRentalForApp(data); setRentalHistory(prev => prev.map(r => r.transactionId === transactionId ? updatedRental : r)); showToast("Rental status updated!"); if (rentalToUpdate.status === 'Active' && newStatus === 'Completed') { const owner = users[rentalToUpdate.ownerEmail]; const renter = users[rentalToUpdate.renterEmail]; if (owner) { const earningsFromRental = rentalToUpdate.rentalTotalCost; const newTotalEarnings = (owner.totalEarningsAmount || 0) + earningsFromRental; const newActiveCount = Math.max(0, (owner.activeRentalsCount || 0) - 1); await updateUser(owner.email, { totalEarningsAmount: newTotalEarnings, activeRentalsCount: newActiveCount }); } if (renter) { const newActiveCount = Math.max(0, (renter.activeRentalsCount || 0) - 1); await updateUser(renter.email, { activeRentalsCount: newActiveCount }); } } };

// --- OTHER FUNCTIONS (Unchanged) ---
const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };
const addToCart = (item) => { if (cart.some(cartItem => cartItem.productId === item.productId)) { showToast("This item is already in your cart."); return false; } setCart(prev => [...prev, item]); showToast("Item added to cart!"); return true; };
const removeFromCart = (productId) => { setCart(prev => prev.filter(item => item.productId !== productId)); showToast("Item removed from cart."); };
const clearCart = () => setCart([]);
const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
const closeChat = () => setChatOpen(false);
const toggleChat = () => setChatOpen(prev => !prev);
const generateAndPrintReceipt = (orderDetails) => { const receiptWindow = window.open('', 'PRINT', 'height=600,width=800'); if (!receiptWindow) { alert("Please disable your pop-up blocker to print the receipt."); return; } const itemsHtml = orderDetails.items.map(item => { const product = products.find(p => p.id === item.productId); return `<tr><td>${product?.title || 'N/A'}</td><td>${item.rentalDurationDays} day(s)</td><td>₱${item.rentalTotalCost.toFixed(2)}</td></tr>`; }).join(''); const receiptDate = orderDetails.date ? new Date(orderDetails.date).toLocaleString() : new Date().toLocaleString(); receiptWindow.document.write('<html><head><title>Hazel Receipt</title>'); receiptWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} h1,h2{text-align:center;}</style>'); receiptWindow.document.write('</head><body>'); receiptWindow.document.write('<h1>HAZEL Rental Receipt</h1>'); receiptWindow.document.write(`<p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>`); receiptWindow.document.write(`<p><strong>Date:</strong> ${receiptDate}</p>`); receiptWindow.document.write('<h2>Rented Items</h2>'); receiptWindow.document.write(`<table><thead><tr><th>Item</th><th>Duration</th><th>Cost</th></tr></thead><tbody>${itemsHtml}</tbody></table>`); receiptWindow.document.write('<h2>Summary</h2>'); receiptWindow.document.write(`<p><strong>Subtotal:</strong> ₱${orderDetails.rentalCost.toFixed(2)}</p>`); receiptWindow.document.write(`<p><strong>Service Fee:</strong> ₱${orderDetails.serviceFee.toFixed(2)}</p>`); receiptWindow.document.write(`<p><strong>Total Paid:</strong> ₱${orderDetails.totalAmount.toFixed(2)}</p>`); receiptWindow.document.write('</body></html>'); receiptWindow.document.close(); receiptWindow.focus(); setTimeout(() => { receiptWindow.print(); receiptWindow.close(); }, 250); };
const toggleFavorite = (productId) => { if (!currentUser || currentUser.role !== 'user') { showToast("Only users can have favorites."); return; } const isFavorite = currentUser.favoriteListingIds.includes(productId); const updatedFavorites = isFavorite ? currentUser.favoriteListingIds.filter(id => id !== productId) : [...currentUser.favoriteListingIds, productId]; showToast(isFavorite ? "Removed from favorites." : "Added to favorites."); updateUser(currentUser.email, { favoriteListingIds: updatedFavorites }); };

const value = { theme, toggleTheme, toast, showToast, products, allTags, addProduct, updateProduct, deleteProduct, updateProductStatus, users, currentUser, updateUser, login, logout, signup, cart, addToCart, removeFromCart, clearCart, rentalAgreementTemplate, setRentalAgreementTemplate, addRentalRecord, updateRentalStatus, toggleFavorite, isChatOpen, chatPartner, openChat, closeChat, toggleChat, rentalHistory: rentalHistory.filter(r => r.renterEmail === currentUser?.email), ownerLentHistory: rentalHistory.filter(r => r.ownerEmail === currentUser?.email), generateAndPrintReceipt };

return (
    <AppContext.Provider value={value}>
        {isLoading ? <div style={{paddingTop: '200px', textAlign: 'center'}}><h1>Loading Hazel from Supabase...</h1></div> : children}
    </AppContext.Provider>
);
};
export default AppContext;