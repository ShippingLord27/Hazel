import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

const FavoriteProductCard = ({ product }) => {
    const { currentUser, toggleFavorite } = useApp();
    const navigate = useNavigate();
    const isFavorite = currentUser?.favoriteListingIds.includes(product.id);

    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta profile-card-meta">
                     <button className="btn btn-primary view-listing btn-small" onClick={() => navigate(`/listing/${product.id}`)}>Details</button>
                     <button className={`btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Toggle Favorite">
                        <i className="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    )
};

const Favorites = () => {
    // 1. Get `products` directly from the context
    const { currentUser, products } = useApp();

    // 2. Derive the list of favorite products using the user's IDs and the full products list
    const favoriteProducts = currentUser?.favoriteListingIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) || [];

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>My Favorites</h1></div>
            {favoriteProducts.length > 0 ? (
                <div className="products-grid">
                    {favoriteProducts.map(p => <FavoriteProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <p>You haven't favorited any items yet.</p>
            )}
        </div>
    );
};

export default Favorites;