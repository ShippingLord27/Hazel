import React, { useState, useEffect, useRef } from 'react';

const CategoryFilter = ({ categories, activeFilter, onFilterClick, listClassName = '', listId = '' }) => {
    const scrollContainerRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    // Checks if scrolling is possible and updates the state for arrow visibility
    const checkScrollable = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const hasOverflow = container.scrollWidth > container.clientWidth;
            setIsScrollable(hasOverflow);
            
            // Check scroll position to hide/show arrows
            const scrollLeft = Math.ceil(container.scrollLeft); // Use ceil to handle subpixel values
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            
            setAtStart(scrollLeft === 0);
            setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1); // -1 for tolerance
        }
    };

    // Effect to check scrollability on mount and window resize
    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [categories]); // Rerun if categories change

    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.7; // Scroll 70% of the visible width
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            // checkScrollable might not update immediately due to smooth scroll
            // We can use a timeout to re-check after the scroll animation
            setTimeout(checkScrollable, 350);
        }
    };
    
    return (
        <div className="category-filter-container">
            {isScrollable && !atStart && (
                <button className="scroll-arrow left" onClick={() => handleScroll('left')} aria-label="Scroll left">
                    <i className="fas fa-chevron-left"></i>
                </button>
            )}
            <div className="scroll-wrapper" ref={scrollContainerRef} onScroll={checkScrollable}>
                <ul className={listClassName} id={listId}>
                    {categories.map(cat => (
                        <li key={cat} className={activeFilter === cat ? 'active' : ''} onClick={() => onFilterClick(cat)}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </li>
                    ))}
                </ul>
            </div>
            {isScrollable && !atEnd && (
                <button className="scroll-arrow right" onClick={() => handleScroll('right')} aria-label="Scroll right">
                    <i className="fas fa-chevron-right"></i>
                </button>
            )}
        </div>
    );
};

export default CategoryFilter;