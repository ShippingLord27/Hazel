
import React from 'react';
import { useApp } from '../../hooks/useApp';
import ProductCard from '../../components/ProductCard';

const Favorites = () => {
    const { items, favorites, itemsLoading } = useApp();

    if (itemsLoading) {
        return (
            <div className="profile-view">
                <div className="profile-view-header"><h1>My Favorites</h1></div>
                <p>Loading favorites...</p>
            </div>
        );
    }
    
    const favoriteItems = favorites
        .map(id => items.find(p => p.id === id))
        .filter(Boolean); // Filter out any undefined items that might result from a mismatch

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>My Favorites</h1></div>
            {favoriteItems.length > 0 ? (
                <div className="products-grid">
                    {favoriteItems.map(item => <ProductCard key={item.id} item={item} />)}
                </div>
            ) : (
                <p>You haven't favorited any items yet. Click the heart icon on any item to save it here.</p>
            )}
        </div>
    );
};

export default Favorites;
