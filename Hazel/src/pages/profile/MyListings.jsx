import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import ListingModal from '../../components/ListingModal';

const ProfileProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta profile-card-meta">
                    <button className="btn btn-outline btn-small" onClick={() => onEdit(product)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => onDelete(product.id)}><i className="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    );
};

const MyListings = () => {
    // 1. Get the full 'users' object and 'products' array from the context
    const { currentUser, users, products, deleteProduct } = useApp();
    const [isListingModalOpen, setListingModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    
    const handleEditListing = (product) => {
        setProductToEdit(product);
        setListingModalOpen(true);
    };

    const handleAddListing = () => {
        setProductToEdit(null);
        setListingModalOpen(true);
    };

    const handleDeleteListing = (productId) => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            deleteProduct(productId);
        }
    };

    // 2. Get the most up-to-date user data from the master 'users' list. This is the single source of truth.
    const freshUserData = users[currentUser.email];

    // 3. Use the IDs from this fresh user object to find the products.
    const myListings = freshUserData ? freshUserData.myListingIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) : []; // Gracefully handle if user somehow doesn't exist

    return (
        <>
            <div className="profile-view">
                <div className="profile-view-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>My Listings</h1>
                    <button className="btn btn-primary" onClick={handleAddListing}>Add New Listing</button>
                </div>
                {myListings.length > 0 ? (
                    <div className="products-grid">
                        {myListings.map(p => <ProfileProductCard key={p.id} product={p} onEdit={handleEditListing} onDelete={handleDeleteListing} />)}
                    </div>
                ) : (
                    <p>You haven't listed any items yet.</p>
                )}
            </div>
             {isListingModalOpen && (
                <ListingModal 
                    productToEdit={productToEdit} 
                    closeModal={() => setListingModalOpen(false)}
                />
            )}
        </>
    );
};

export default MyListings;