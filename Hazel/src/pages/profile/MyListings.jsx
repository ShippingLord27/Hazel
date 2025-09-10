
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import ListingModal from '../../components/ListingModal';

const ProfileProductCard = ({ item, onEdit, onDelete }) => {
    return (
        <div className="product-card">
            <img src={item.image_url} alt={item.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{item.category}</span>
                <h3 className="product-title">{item.title}</h3>
                <div className="product-price">${item.price_per_day}/day</div>
                <div className="product-meta profile-card-meta">
                    <button className="btn btn-outline btn-small" onClick={() => onEdit(item)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => onDelete(item.id)}><i className="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    );
};

const MyListings = () => {
    const { currentUser, items, deleteItem } = useApp();
    const [isListingModalOpen, setListingModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    
    const handleEditListing = (item) => {
        setItemToEdit(item);
        setListingModalOpen(true);
    };

    const handleAddListing = () => {
        setItemToEdit(null);
        setListingModalOpen(true);
    };

    const handleDeleteListing = (itemId) => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            deleteItem(itemId);
        }
    };

    const myListings = currentUser 
        ? items.filter(i => i.ownerId === currentUser.uid) 
        : [];

    return (
        <>
            <div className="profile-view">
                <div className="profile-view-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>My Listings</h1>
                    <button className="btn btn-primary" onClick={handleAddListing}>Add New Listing</button>
                </div>
                {myListings.length > 0 ? (
                    <div className="products-grid">
                        {myListings.map(item => <ProfileProductCard key={item.id} item={item} onEdit={handleEditListing} onDelete={handleDeleteListing} />)}
                    </div>
                ) : (
                    <p>You haven't listed any items yet. Click "Add New Listing" to get started!</p>
                )}
            </div>
            {isListingModalOpen && (
                <ListingModal 
                    itemToEdit={itemToEdit} 
                    closeModal={() => setListingModalOpen(false)}
                />
            )}
        </>
    );
};

export default MyListings;
