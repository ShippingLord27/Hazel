
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProductCard = ({ item }) => {
    const { currentUser, favorites, toggleFavorite } = useApp();
    const navigate = useNavigate();

    const isFavorite = favorites.includes(item.id);

    // Safely access nested properties
    const imageUrl = item.image_url || 'https://via.placeholder.com/150';
    const categoryName = item.category || 'Uncategorized';
    const priceDisplay = item.price_per_day ? `₱${Number(item.price_per_day).toFixed(2)}/day` : 'Price not available';

    return (
        <div className="product-card" data-product-id={item.id}>
            <img src={imageUrl} alt={item.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{categoryName}</span>
                <h3 className="product-title">{item.title}</h3>
                <div className="product-price">{priceDisplay}</div>
                <div className="product-meta">
                    <div className="product-rating">
                        {/* Static rating for now. Could be dynamic in the future. */}
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                    </div>
                    <div className="product-actions">
                         <button 
                            className="btn btn-primary view-listing btn-small" 
                            onClick={() => navigate(`/listing/${item.id}`)}
                         >
                            Details
                         </button>
                         {currentUser && currentUser.role === 'renter' && (
                            <button 
                                className={`btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}`} 
                                aria-label="Toggle Favorite"
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
