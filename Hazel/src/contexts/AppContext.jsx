import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '../supabaseClient'; // Import environment variables
import { initialProductData, initialRentalAgreement } from '../data/initialData'; // Fallback data

export const AppContext = createContext(null);

const getFullUserProfile = async (user) => {
    if (!user) return null;
    // First, get the unified profile to know the role
    const { data: profileView, error: viewError } = await supabase
        .from('user_profiles_view')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (viewError || !profileView) {
        // This can happen briefly after signup before the trigger runs.
        // Return the base user, the listener will catch the update.
        return { ...user, profile: { name: user.email, role: user.user_metadata.role } };
    }

    // Now, fetch from the role-specific table to get more details and the role-specific ID
    let roleSpecificProfile = {};
    let favorite_item_ids = []; // Add a place to store favorite IDs
    if (profileView.role && ['renter', 'owner', 'admin'].includes(profileView.role)) {
        const { data: roleData } = await supabase
            .from(`${profileView.role}s`) // e.g., 'renters', 'owners'
            .select('*')
            .eq('user_id', user.id)
            .single();
        if (roleData) {
            roleSpecificProfile = roleData;
            // If the user is a renter, fetch their favorites
            if (profileView.role === 'renter' && roleData.renter_id) {
                const { data: favoritesData, error: favError } = await supabase
                    .from('favorites')
                    .select('item_id')
                    .eq('renter_id', roleData.renter_id);
                
                if (!favError && favoritesData) {
                    favorite_item_ids = favoritesData.map(f => f.item_id);
                }
            }
        }
    }
    
    // Combine everything
    return { ...user, profile: { ...profileView, ...roleSpecificProfile, favorite_item_ids } };
};

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => { const savedTheme = localStorage.getItem('theme') || 'light'; document.body.classList.toggle('dark-mode', savedTheme === 'dark'); return savedTheme; });
    const [products, setProducts] =useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [allProfiles, setAllProfiles] = useState([]);
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isChatOpen, setChatOpen] = useState(false);
    const [chatPartner, setChatPartner] = useState({ id: 'support', name: 'HAZEL Support', context: null });
    const [rentalHistory, setRentalHistory] = useState([]);
    const [rentalAgreementTemplate, setRentalAgreementTemplate] = useState(initialRentalAgreement);
    const [isLoading, setIsLoading] = useState(true);

    console.log("AppContext: isLoading", isLoading);

    const transformItemForApp = (itemFromDb) => {
        if (!itemFromDb) return null;
        return {
            id: itemFromDb.item_id,
            title: itemFromDb.title,
            fullTitle: itemFromDb.title, // New schema doesn't have fullTitle, use title
            category: itemFromDb.categories ? itemFromDb.categories.name : 'Uncategorized',
            price: itemFromDb.price_per_day,
            priceDisplay: `₱${itemFromDb.price_per_day}/day`,
            image: itemFromDb.image_url,
            description: itemFromDb.description,
            ownerId: itemFromDb.owners ? itemFromDb.owners.user_id : null, // This is the owner's user_id (UUID)
            ownerName: itemFromDb.owners ? itemFromDb.owners.name : 'Unknown Owner',
            trackingTagId: itemFromDb.tracking_tag_id,
            ownerTerms: itemFromDb.owner_terms,
            status: itemFromDb.availability ? 'approved' : 'unavailable', // Map availability to status
            reviews: [], // No reviews in new schema
            tags: [] // No tags in new schema
        };
    };
    
    const transformItemForDb = (productFromApp, owner_id, category_id) => {
        return {
            owner_id: owner_id,
            title: productFromApp.title,
            description: productFromApp.description,
            category_id: category_id,
            image_url: productFromApp.image,
            price_per_day: productFromApp.price,
            availability: true, // New items are available by default, admin can change
            tracking_tag_id: productFromApp.trackingTagId,
            owner_terms: productFromApp.ownerTerms,
        };
    };

    const transformTransactionForApp = (transactionFromDb) => {
        if (!transactionFromDb) return null;
        const startDate = new Date(transactionFromDb.start_date);
        const endDate = new Date(transactionFromDb.end_date);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

        return {
            transactionId: transactionFromDb.transaction_id,
            productId: transactionFromDb.item_id, // Map item_id to productId for component compatibility
            renterId: transactionFromDb.renter_id,
            rentalStartDate: transactionFromDb.start_date,
            rentalDurationDays: duration,
            totalAmount: transactionFromDb.total_amount,
            deliveryFee: transactionFromDb.delivery_fee,
            serviceFee: transactionFromDb.service_fee,
            rentalTotalCost: transactionFromDb.total_amount - transactionFromDb.delivery_fee - transactionFromDb.service_fee,
            status: transactionFromDb.status,
            // The app will need to fetch renter/owner names based on IDs if needed
        };
    };


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
            console.log("AppContext: Initial currentUser", user);
            
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
                const user = await getFullUserProfile(newSession?.user);
                setCurrentUser(user);
                console.log("AppContext: Auth state change - currentUser", user);
                
                if (user && user.profile.role === 'admin') {
                    const { data: allUsersData } = await supabase.from('user_profiles_view').select('*');
                    setAllProfiles(allUsersData || []);
                    console.log("AppContext: Admin - allProfiles", allUsersData);
                } else {
                    setAllProfiles([]);
                }
            });
            return subscription;
        };

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, transactionsRes, categoriesRes] = await Promise.all([
                    supabase.from('items').select('*, categories(name), owners(name, user_id)'),
                    supabase.from('transactions').select('*'),
                    supabase.from('categories').select('*')
                ]);
    
                if (itemsRes.error || transactionsRes.error || categoriesRes.error) {
                    console.error(itemsRes.error || transactionsRes.error || categoriesRes.error);
                    throw new Error(`Supabase data fetching error.`);
                }
                
                const categoriesData = categoriesRes.data || [];
                setCategories(categoriesData);
    
                const transformedProducts = (itemsRes.data || []).map(transformItemForApp);
                setProducts(transformedProducts);
                console.log("AppContext: Fetched products", transformedProducts);
                
                const transformedRentals = (transactionsRes.data || []).map(transformTransactionForApp);
                setRentalHistory(transformedRentals);
                console.log("AppContext: Fetched rental history", transformedRentals);
    
            } catch (error) {
                 console.error("CRITICAL: Error fetching data from Supabase. Application will show empty data.", error);
                 setProducts([]);
                 setCategories([]);
            } finally {
                setIsLoading(false);
                console.log("AppContext: fetchInitialData finished, isLoading set to false");
            }
        };
    
        fetchInitialData();
        const subscription = setupAuthListener();
        console.log("Supabase URL:", VITE_SUPABASE_URL);
        console.log("Supabase Anon Key:", VITE_SUPABASE_ANON_KEY);
        return () => { subscription.then(sub => sub.unsubscribe()); };
    }, []);

    const showToast = (message, duration = 3000) => { setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), duration); };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { showToast(error.message); return null; }
        return await getFullUserProfile(data.user);
    };
    
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast("Logout failed.", "error");
        } else {
            showToast('Logged out successfully.');
        }
    };

    const signup = async (userData, role) => {
        const { email, password, firstName, lastName } = userData;
        const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { data: { first_name: firstName, last_name: lastName, role: role } }
        });
        if (error) showToast(error.message);
        else showToast('Account created! Please check your email for verification.');
        return data.user;
    };

    const updateUser = async (userId, updatedData) => {
        const user = currentUser.id === userId ? currentUser : allProfiles.find(p => p.user_id === userId);
        if (!user || !user.profile.role) {
            showToast("Cannot update user: role not found.");
            return;
        }
        const roleTable = `${user.profile.role}s`; // 'renters', 'owners', 'admins'

        const dbReadyData = {};
        // Map app-friendly keys to db columns
        if (updatedData.firstName || updatedData.lastName) {
            dbReadyData.name = `${updatedData.firstName || user.profile.first_name} ${updatedData.lastName || user.profile.last_name}`.trim();
        }
        if (updatedData.location) dbReadyData.address = updatedData.location;
        if (updatedData.phone) dbReadyData.phone = updatedData.phone;

        // Password update
        if (updatedData.password) {
            const { error: passwordError } = await supabase.auth.updateUser({ password: updatedData.password });
            if (passwordError) {
                showToast(`Password update failed: ${passwordError.message}`);
                return;
            }
        }

        // Update role-specific table
        if (Object.keys(dbReadyData).length > 0) {
            const { error } = await supabase.from(roleTable).update(dbReadyData).eq('user_id', userId);
            if (error) {
                showToast(`Profile update failed: ${error.message}`);
                return;
            }
        }

        // Refresh current user data
        const refreshedUser = await getFullUserProfile({ id: userId });
        if (refreshedUser) {
            setCurrentUser(refreshedUser);
            showToast("Profile updated successfully!");
        }
    };
    
    const addProduct = async (productDataFromModal) => {
        if (!currentUser || currentUser.profile.role !== 'owner' || !currentUser.profile.owner_id) {
            showToast("You must be an owner to add a listing.");
            return;
        }
        const category = categories.find(c => c.name.toLowerCase() === productDataFromModal.category.toLowerCase());
        if (!category) {
            showToast("Invalid category selected.");
            return;
        }

        const dbReadyProduct = transformItemForDb(productDataFromModal, currentUser.profile.owner_id, category.category_id);
        
        const { data, error } = await supabase.from('items').insert(dbReadyProduct).select('*, categories(name), owners(name, user_id)').single();
        if (error) {
            showToast("Failed to create listing. Please check console for details.");
            console.error("Add product error:", error);
            return;
        }
        const appReadyProduct = transformItemForApp(data);
        setProducts(prev => [...prev, appReadyProduct]);
        showToast("Listing added successfully!");
    };
    const updateProduct = async (updatedProduct) => {
        const category = categories.find(c => c.name.toLowerCase() === updatedProduct.category.toLowerCase());
        const dbReadyProduct = {
            title: updatedProduct.title,
            description: updatedProduct.description,
            category_id: category ? category.category_id : null,
            image_url: updatedProduct.image,
            price_per_day: updatedProduct.price,
            tracking_tag_id: updatedProduct.trackingTagId,
            owner_terms: updatedProduct.ownerTerms,
        };
        const { data, error } = await supabase.from('items').update(dbReadyProduct).eq('item_id', updatedProduct.id).select('*, categories(name), owners(name, user_id)').single();
        if (error) { showToast("Failed to update listing."); console.error(error); return; }
        const appReadyProduct = transformItemForApp(data);
        setProducts(prev => prev.map(p => p.id === appReadyProduct.id ? appReadyProduct : p));
        showToast("Listing updated successfully!");
    };
    const deleteProduct = async (productId) => {
        const productToDelete = products.find(p => p.id === productId);
        if (!productToDelete) return;
        const { error } = await supabase.from('items').delete().eq('item_id', productId);
        if (error) {
            showToast("Failed to delete listing.");
            console.error(error);
            return;
        }
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast(`Listing has been deleted.`);
    };
    const updateProductStatus = async (productId, newStatus) => {
        const availability = newStatus === 'approved';
        const { data, error } = await supabase.from('items').update({ availability: availability }).eq('item_id', productId).select('*, categories(name), owners(name, user_id)').single();
        if (error) { showToast("Failed to update listing status."); console.error(error); return; }
        const appReadyProduct = transformItemForApp(data);
        setProducts(prev => prev.map(p => (p.id === productId ? appReadyProduct : p)));
        showToast(`Listing status updated to ${availability ? 'Available' : 'Unavailable'}.`);
    };

    const addRentalRecord = async (orderDetails) => {
        if (!currentUser || !currentUser.profile.renter_id) { showToast("User is not a renter."); return; }
        const transactionsForDb = orderDetails.items.map(item => {
            const startDate = new Date(item.rentalStartDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + item.rentalDurationDays);
            return {
                renter_id: currentUser.profile.renter_id,
                item_id: item.productId,
                start_date: item.rentalStartDate,
                end_date: endDate.toISOString().split('T')[0],
                total_amount: item.rentalTotalCost + item.deliveryFee + orderDetails.serviceFee,
                payment_method: 'gcash', // Hardcoded as per new schema requirement
                status: 'pending', // Or 'completed' if payment is instant
                delivery_fee: item.deliveryFee,
                service_fee: orderDetails.serviceFee / orderDetails.items.length, // Distribute service fee
            };
        });
        const { data, error } = await supabase.from('transactions').insert(transactionsForDb).select();
        if (error) { showToast("Failed to record rental history."); console.error("Add rental history error:", error); return; }
        const transformedNewRentals = data.map(transformTransactionForApp);
        setRentalHistory(prev => [...prev, ...transformedNewRentals]);
    };
    const updateRentalStatus = async (transactionId, newStatus) => {
        const { data, error } = await supabase.from('transactions').update({ status: newStatus }).eq('transaction_id', transactionId).select().single();
        if (error) { showToast("Failed to update rental status."); console.error("Update rental status error:", error); return; }
        const updatedRental = transformTransactionForApp(data);
        setRentalHistory(prev => prev.map(r => r.transactionId === transactionId ? updatedRental : r));
        showToast("Rental status updated!");
    };

    const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.body.classList.toggle('dark-mode', newTheme === 'dark'); };
    const addToCart = (item) => { if (cart.some(cartItem => cartItem.productId === item.productId)) { showToast("This item is already in your cart."); return false; } setCart(prev => [...prev, item]); showToast("Item added to cart!"); return true; };
    const removeFromCart = (productId) => { setCart(prev => prev.filter(item => item.productId !== productId)); showToast("Item removed from cart."); };
    const clearCart = () => setCart([]);
    const openChat = (partnerDetails) => { setChatPartner(partnerDetails); setChatOpen(true); };
    const closeChat = () => setChatOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);
    const generateAndPrintReceipt = (orderDetails) => { const receiptWindow = window.open('', 'PRINT', 'height=600,width=800'); if (!receiptWindow) { alert("Please disable your pop-up blocker to print the receipt."); return; } const itemsHtml = orderDetails.items.map(item => { const product = products.find(p => p.id === item.productId); return `<tr><td>${product?.title || 'N/A'}</td><td>${item.rentalDurationDays} day(s)</td><td>₱${item.rentalTotalCost.toFixed(2)}</td></tr>`; }).join(''); const receiptDate = orderDetails.date ? new Date(orderDetails.date).toLocaleString() : new Date().toLocaleString(); receiptWindow.document.write('<html><head><title>Hazel Receipt</title>'); receiptWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} h1,h2{text-align:center;}</style>'); receiptWindow.document.write('</head><body>'); receiptWindow.document.write('<h1>HAZEL Rental Receipt</h1>'); receiptWindow.document.write(`<p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>`); receiptWindow.document.write(`<p><strong>Date:</strong> ${receiptDate}</p>`); receiptWindow.document.write('<h2>Rented Items</h2>'); receiptWindow.document.write(`<table><thead><tr><th>Item</th><th>Duration</th><th>Cost</th></tr></thead><tbody>${itemsHtml}</tbody></table>`); receiptWindow.document.write('<h2>Summary</h2>'); receiptWindow.document.write(`<p><strong>Subtotal:</strong> ₱${orderDetails.rentalCost.toFixed(2)}</p>`); receiptWindow.document.write(`<p><strong>Service Fee:</strong> ₱${orderDetails.serviceFee.toFixed(2)}</p>`); receiptWindow.document.write(`<p><strong>Total Paid:</strong> ₱${orderDetails.totalAmount.toFixed(2)}</p>`); receiptWindow.document.write('</body></html>'); receiptWindow.document.close(); receiptWindow.focus(); setTimeout(() => { receiptWindow.print(); receiptWindow.close(); }, 250); };
    
    const toggleFavorite = async (productId) => {
        if (!currentUser || currentUser.profile.role !== 'renter' || !currentUser.profile.renter_id) {
            showToast("Only renters can have favorites.");
            return;
        }
        const isFavorite = currentUser.profile.favorite_item_ids.includes(productId);
        const renterId = currentUser.profile.renter_id;

        if (isFavorite) {
            const { error } = await supabase.from('favorites').delete().match({ renter_id: renterId, item_id: productId });
            if (error) {
                showToast("Failed to remove from favorites.");
            } else {
                setCurrentUser(prev => ({ ...prev, profile: { ...prev.profile, favorite_item_ids: prev.profile.favorite_item_ids.filter(id => id !== productId) } }));
                showToast("Removed from favorites.");
            }
        } else {
            const { error } = await supabase.from('favorites').insert({ renter_id: renterId, item_id: productId });
            if (error) {
                showToast("Failed to add to favorites.");
            } else {
                setCurrentUser(prev => ({ ...prev, profile: { ...prev.profile, favorite_item_ids: [...prev.profile.favorite_item_ids, productId] } }));
                showToast("Added to favorites!");
            }
        }
    };
    
    const value = { theme, toggleTheme, toast, showToast, products, categories, addProduct, updateProduct, deleteProduct, updateProductStatus, currentUser, allProfiles, updateUser, login, logout, signup, cart, addToCart, removeFromCart, clearCart, rentalAgreementTemplate, setRentalAgreementTemplate, addRentalRecord, updateRentalStatus, toggleFavorite, isChatOpen, chatPartner, openChat, closeChat, toggleChat, rentalHistory: rentalHistory.filter(r => currentUser?.profile?.renter_id && r.renterId === currentUser.profile.renter_id), ownerLentHistory: rentalHistory.filter(r => { const product = products.find(p => p.id === r.productId); return product && product.ownerId === currentUser?.id; }), generateAndPrintReceipt };

    return (
        <AppContext.Provider value={value}>
            {isLoading ? (
                <div style={{ paddingTop: '200px', textAlign: 'center', minHeight: '100vh' }}><h1>Loading Hazel from Supabase...</h1></div>
            ) : children}
        </AppContext.Provider>
    );
};