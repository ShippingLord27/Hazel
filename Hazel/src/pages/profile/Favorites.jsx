import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import ProductCard from '../../components/ProductCard'; // Re-use the main ProductCard

const Favorites = () => {
    // Get isLoading and currentUser from the context
    const { currentUser, products, isLoading } = useApp();

    // --- BULLETPROOF LOADING CHECK ---
    if (isLoading) {
        return (
            <div className="profile-view">
                <div className="profile-view-header"><h1>My Favorites</h1></div>
                <p>Loading favorites...</p>
            </div>
        );
    }
    
    // Ensure currentUser and favoriteListingIds exist before trying to map
    const favoriteProducts = currentUser?.favoriteListingIds
        ? currentUser.favoriteListingIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean) // This removes any undefined items if a product was deleted
        : [];

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>My Favorites</h1></div>
            {favoriteProducts.length > 0 ? (
                <div className="products-grid">
                    {/* We can reuse the main ProductCard component for consistency */}
                    {favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <p>You haven't favorited any items yet. Click the heart icon on any product to save it here.</p>
            )}
        </div>
    );
};

export default Favorites;