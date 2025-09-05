import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const { products, currentUser, allTags } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const tagQuery = searchParams.get('tag');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(tagQuery || 'all');
    const tagsForFilter = ['all', ...allTags.sort()];

    useEffect(() => {
        const tagQuery = searchParams.get('tag');
        if (tagQuery && tagsForFilter.includes(tagQuery)) {
            setActiveFilter(tagQuery);
        } else {
            setActiveFilter('all');
        }
    }, [searchParams, tagsForFilter]);

    const filteredProducts = useMemo(() => {
        // FIX: Default to non-admin view if currentUser is not yet loaded or is not an admin
        const isAdmin = currentUser?.role === 'admin';
        const visibleProducts = isAdmin ? products : products.filter(p => p.status === 'approved');

        return visibleProducts.filter(product => {
            const matchesTag = activeFilter === 'all' || (product.tags && product.tags.includes(activeFilter));
            const lowercasedTerm = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' ||
                product.title.toLowerCase().includes(lowercasedTerm) ||
                product.description.toLowerCase().includes(lowercasedTerm) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)));
            return matchesTag && matchesSearch;
        });
    }, [products, searchTerm, activeFilter, currentUser]);

    const handleFilterClick = (tag) => {
        setActiveFilter(tag);
        setSearchParams(tag === 'all' ? {} : { tag });
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
                        {tagsForFilter.map(tag => (
                             <li key={tag} className={activeFilter === tag ? 'active' : ''} onClick={() => handleFilterClick(tag)}>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
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