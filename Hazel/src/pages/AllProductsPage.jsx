
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const { items, categories, itemsLoading } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all');

    const categoriesForFilter = useMemo(() => ['all', ...categories.map(c => c.name).sort()], [categories]);

    const filteredItems = useMemo(() => {
        let results = items;
        if (activeFilter !== 'all') {
            results = results.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());
        }
        if (searchTerm) {
            results = results.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }
        return results;
    }, [items, activeFilter, searchTerm]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setSearchParams({ category: category, search: searchTerm });
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSearchParams({ category: activeFilter, search: e.target.value });
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
                        <input type="text" className="search-input" placeholder="Search by name or tag..." value={searchTerm} onChange={handleSearchChange} />
                    </div>
                    <ul className="products-filter" id="productsPageFilter">
                        {categoriesForFilter.map(cat => (
                             <li key={cat} className={activeFilter === cat ? 'active' : ''} onClick={() => handleFilterClick(cat)}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </li>
                        ))}
                    </ul>
                </section>
                {itemsLoading ? (
                    <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
                ) : filteredItems.length > 0 ? (
                    <div className="products-grid" id="allProductsGrid">
                        {filteredItems.map(item => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="no-products-found">
                        <p>No items match your current filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;
