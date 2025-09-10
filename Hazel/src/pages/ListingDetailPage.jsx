
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ReviewModal from '../components/ReviewModal';

const ListingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { items, addToCart, currentUser, showToast, openChat, allProfiles } = useApp();
    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [rentalOptions, setRentalOptions] = useState({ days: '1', deliveryFee: '0', startDate: '' });
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);

    const itemOwner = useMemo(() => {
        if (!item || !allProfiles.length) return null;
        return allProfiles.find(p => p.id === item.ownerId);
    }, [item, allProfiles]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const foundItem = items.find(p => p.id === id);
        if (foundItem) {
            setItem(foundItem);
            setSelectedImage(foundItem.image_url);
        } else if (items.length > 0) { // Avoid redirecting while items are still loading
            showToast("Sorry, that listing could not be found.");
            navigate('/products');
        }
    }, [id, items, navigate, showToast]);

    const rentalPriceDetails = useMemo(() => {
        if (!item) return { total: 0, perDay: 0 };
        const basePrice = item.price_per_day;
        const days = parseInt(rentalOptions.days);
        // Discount logic can be added here if needed in the future
        let total = basePrice * days;
        const perDay = total / days;
        return { total, perDay };
    }, [item, rentalOptions.days]);

    const handleOptionChange = (e) => setRentalOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddToCart = () => {
        if (!currentUser) { showToast("Please login to rent an item."); return; }
        if (currentUser.uid === item.ownerId) { showToast("You cannot rent your own item."); return; }
        if (!rentalOptions.startDate) { showToast("Please select a rental start date."); return; }
        
        const cartItem = {
            itemId: item.id,
            title: item.title,
            image_url: item.image_url,
            rentalDurationDays: parseInt(rentalOptions.days),
            rentalTotalCost: rentalPriceDetails.total,
            deliveryOption: rentalOptions.deliveryFee === '0' ? 'pickup' : 'delivery',
            deliveryFee: parseInt(rentalOptions.deliveryFee),
            rentalStartDate: rentalOptions.startDate,
            ownerId: item.ownerId
        };
        
        const success = addToCart(cartItem);
        if (success) { navigate('/cart'); }
    };
    
    const handleChatWithOwner = async () => {
        if (!currentUser) { showToast("Please login to chat with the owner."); return; }
        if (!itemOwner) { showToast("Owner information not available."); return; }
        const partner = { id: itemOwner.id, name: `${itemOwner.firstName} ${itemOwner.lastName}`, profile_pic_url: itemOwner.profile_pic_url };
        openChat(partner);
        // Future implementation could navigate to a specific chat thread
        // navigate(`/chat?thread_id=${threadId}`);
    };

    const getTodayString = () => new Date().toISOString().split('T')[0];
    if (!item) { return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading listing...</div>; }

    return (
        <>
            <div className="page active listing-page" style={{ paddingTop: '70px' }}>
                <div className="container listing-container">
                     <div className="listing-content">
                        <div className="listing-images">
                            {/* Add logic for multiple images if available in the future */}
                            <div className="thumbnail-images"><img src={item.image_url} alt={`${item.title} Thumbnail`} className="thumbnail-img" onClick={() => setSelectedImage(item.image_url)} /></div>
                            <img src={selectedImage} alt={item.title} className="main-image" />
                        </div>
                        <div className="listing-details">
                            <h1 className="listing-title">{item.title}</h1>
                            <div className="listing-price">
                                ${rentalPriceDetails.total.toFixed(2)} for {rentalOptions.days} day(s)
                                {parseInt(rentalOptions.days) > 1 && <span> (${rentalPriceDetails.perDay.toFixed(2)}/day)</span>}
                            </div>
                            <div className="listing-meta">
                                <div className="meta-item"><i className="fas fa-user"></i> Owner: <span className="listing-owner-name">{itemOwner ? `${itemOwner.firstName} ${itemOwner.lastName}` : 'N/A'}</span></div>
                                <div className="meta-item"><i className="fas fa-tag"></i> Category: <span className="listing-category">{item.category}</span></div>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="meta-item"><i className="fas fa-tags"></i> Tags: <span className="listing-tags">{item.tags.join(', ')}</span></div>
                                )}
                            </div>
                            <div className="listing-description"><p>{item.description}</p></div>
                            <div className="rental-options">
                                <div className="option-group"><label htmlFor="rentalDays">Rental Duration</label>
                                    <select id="rentalDays" name="days" value={rentalOptions.days} onChange={handleOptionChange}>
                                        <option value="1">1 day</option>
                                        <option value="3">3 days</option>
                                        <option value="7">7 days</option>
                                    </select>
                                </div>
                                <div className="option-group"><label htmlFor="deliveryOption">Delivery Option</label>
                                    <select id="deliveryOption" name="deliveryFee" value={rentalOptions.deliveryFee} onChange={handleOptionChange}>
                                        <option value="0">Pickup - Free</option>
                                        <option value="15">Delivery - $15</option>
                                    </select>
                                </div>
                                <div className="option-group"><label htmlFor="rentalDate">Rental Start Date</label>
                                    <input type="date" id="rentalDate" name="startDate" min={getTodayString()} value={rentalOptions.startDate} onChange={handleOptionChange} />
                                </div>
                            </div>
                            {currentUser && currentUser.role === 'renter' && (
                                <button className="btn btn-primary btn-block" onClick={handleAddToCart}><i className="fas fa-cart-plus"></i> Add to Cart</button>
                            )}
                            {currentUser && itemOwner && currentUser.uid !== itemOwner.id && (
                                <button className="btn btn-outline btn-block listing-chat-owner-btn" onClick={handleChatWithOwner}><i className="fas fa-comments"></i> Chat with Owner</button>
                            )}
                        </div>
                    </div>
                    <div className="reviews-section" id={`reviews-section-${item.id}`}>
                        <h3>Customer Reviews</h3>
                        {/* Review data structure needs to be integrated from the new schema */}
                        <p>No reviews yet for this listing.</p>
                        {currentUser && currentUser.role === 'renter' && (
                            <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={() => setReviewModalOpen(true)}>Leave a Review</button>
                        )}
                    </div>
                </div>
            </div>
            {isReviewModalOpen && <ReviewModal itemId={item.id} itemTitle={item.title} closeModal={() => setReviewModalOpen(false)} />}
        </>
    );
};

export default ListingDetailPage;
