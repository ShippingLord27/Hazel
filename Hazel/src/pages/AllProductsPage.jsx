import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter'; // Import the new component

const AllProductsPage = () => {
    const { items, categories, itemsLoading } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all');

    const categoriesForFilter = useMemo(() => ['all', ...categories.map(c => c.name).sort()], [categories]);

    const filteredItems = useMemo(() => {
        // Only show approved items on the products page
        let results = items.filter(item => item.status === 'approved');
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
        const currentSearch = searchParams.get('search') || '';
        setSearchParams({ category, search: currentSearch });
    };
    
    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setSearchParams({ category: activeFilter, search: newSearchTerm });
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
                    {/* Replace the old ul with the new CategoryFilter component */}
                    <CategoryFilter
                        categories={categoriesForFilter}
                        activeFilter={activeFilter}
                        onFilterClick={handleFilterClick}
                        listClassName="products-filter"
                        listId="productsPageFilter"
                    />
                </section>
                {itemsLoading ? (
                    <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>
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