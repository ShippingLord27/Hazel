import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const { products, currentUser, categories } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(categoryQuery || 'all');
    const categoriesForFilter = ['all', ...categories.map(c => c.name).sort()];

    useEffect(() => {
        const categoryQuery = searchParams.get('category');
        if (categoryQuery && categoriesForFilter.includes(categoryQuery)) {
            setActiveFilter(categoryQuery);
        } else {
            setActiveFilter('all');
        }
    }, [searchParams, categoriesForFilter]);

    const filteredProducts = useMemo(() => {
        const isAdmin = currentUser?.profile?.role === 'admin';
        const visibleProducts = isAdmin ? products : products.filter(p => p.status === 'approved');

        return visibleProducts.filter(product => {
            const matchesCategory = activeFilter === 'all' || product.category.toLowerCase() === activeFilter.toLowerCase();
            const lowercasedTerm = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' ||
                product.title.toLowerCase().includes(lowercasedTerm) ||
                product.description.toLowerCase().includes(lowercasedTerm);
            return matchesCategory && matchesSearch;
        });
    }, [products, searchTerm, activeFilter, currentUser, categories]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setSearchParams(category === 'all' ? {} : { category });
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
                        <input type="text" className="search-input" placeholder="Search by name or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <ul className="products-filter" id="productsPageFilter">
                        {categoriesForFilter.map(cat => (
                             <li key={cat} className={activeFilter === cat ? 'active' : ''} onClick={() => handleFilterClick(cat)}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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