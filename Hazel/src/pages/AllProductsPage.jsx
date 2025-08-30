import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { currentUser, toggleFavorite } = useApp();
    const isFavorite = currentUser?.favoriteListingIds.includes(product.id);

    return (
        <div className="product-card" data-product-id={product.id}>
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta">
                    <div className="product-rating">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                    </div>
                    <div className="product-actions">
                         <button className="btn btn-primary view-listing btn-small" onClick={() => navigate(`/listing/${product.id}`)}>Details</button>
                         {currentUser && !currentUser.isAdmin && (
                            <button 
                                className={`btn btn-icon favorite-toggle-btn ${isFavorite ? 'active' : ''}`} 
                                aria-label="Toggle Favorite"
                                onClick={() => toggleFavorite(product.id)}
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


const AllProductsPage = () => {
    const { products } = useApp();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const categoryQuery = searchParams.get('category');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(categoryQuery || 'all');
    
    const categories = ['all', 'tools', 'electronics', 'vehicles', 'party', 'sports'];

    // Update filter when URL query param changes
    useEffect(() => {
        const categoryQuery = searchParams.get('category');
        if (categoryQuery && categories.includes(categoryQuery)) {
            setActiveFilter(categoryQuery);
        } else {
            setActiveFilter('all');
        }
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = activeFilter === 'all' || product.category.toLowerCase() === activeFilter;
            const matchesSearch = searchTerm === '' || 
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchTerm, activeFilter]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        if (category === 'all') {
            navigate('/products');
        } else {
            navigate(`/products?category=${category}`);
        }
    };

    return (
        <div className="page active" id="all-products-page" style={{ paddingTop: '70px' }}>
            <div className="container products-page-container">
                <section className="products-page-header-section">
                    <h1>Our Full Catalog</h1>
                    <p>Browse all available items for rent. Use the filters and search to find exactly what you need.</p>
                </section>

                <section className="products-page-controls">
                    <div className="products-page-search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search all products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul className="products-filter" id="productsPageFilter">
                        {categories.map(category => (
                             <li 
                                key={category}
                                className={activeFilter === category ? 'active' : ''}
                                onClick={() => handleFilterClick(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </li>
                        ))}
                    </ul>
                </section>

                {filteredProducts.length > 0 ? (
                    <div className="products-grid" id="allProductsGrid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-products-found">
                        <p>No products match your current filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;