import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta">
                    <div className="product-rating"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i></div>
                    <button className="btn btn-primary view-listing" onClick={() => navigate(`/listing/${product.id}`)}>View Details</button>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    const { products } = useApp();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const popularProducts = useMemo(() => {
        const filtered = activeFilter === 'all' 
            ? products
            : products.filter(p => p.category.toLowerCase() === activeFilter);
        return filtered.slice(0, 6);
    }, [products, activeFilter]);

    const filters = ['all', 'tools', 'electronics', 'vehicles', 'party', 'sports'];

    return (
        <div className="page active" id="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1>Borrow What You Need, When You Need It</h1>
                    <p>Discover the best rental items for your needs at affordable prices. From tools to electronics, we've got you covered.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Items</button>
                </div>
            </section>
            <section className="products" id="products">
                <div className="container">
                    <div className="products-header">
                        <div className="section-title"><h2>Popular Items</h2></div>
                        <ul className="products-filter">
                            {filters.map(filter => (
                                <li key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="products-grid">
                        {popularProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>
            <section className="about" id="about">
                <div className="container">
                    <div className="about-container">
                        <div className="about-img"><img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="About Us" /></div>
                        <div className="about-content">
                            <h2>About Our Rental Service</h2>
                            <p>We started with a simple idea: to make renting items as easy as possible. Our platform connects people who need items with those who have them to rent.</p>
                            <p>With over 10,000 satisfied customers and thousands of items available, we're proud to be the leading rental platform in the region.</p>
                            <Link to="/about" className="btn btn-primary">Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;