import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import AuthModal from './AuthModal';
import Search from './Search';

const Header = () => {
  const { theme, toggleTheme, currentUser, logout, cart } = useApp();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const cartItemCount = cart.length;
  const categories = ['Tools', 'Electronics', 'Vehicles', 'Party', 'Sports'];

  useEffect(() => {
    // Close categories dropdown when main mobile menu closes
    if (!isMobileMenuOpen) {
      setCategoriesOpen(false);
    }
  }, [isMobileMenuOpen]);
  
  const handleProductsClick = (e) => {
    // On mobile, prevent navigation and toggle the dropdown instead
    if (window.innerWidth <= 768) {
        e.preventDefault();
        setCategoriesOpen(!isCategoriesOpen);
    }
    // On desktop, the NavLink will handle navigation, and hover is CSS-driven
  };

  return (
    <>
      <header>
        <div className="container header-container">
          <Link to="/" className="logo" id="homeLogo">HAZEL<span></span></Link>
          
          <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
            <Search />
            <ul>
              <li><NavLink to="/" className="nav-link">Home</NavLink></li>
              <li className={`has-dropdown ${isCategoriesOpen ? 'open' : ''}`}>
                <NavLink to="/products" className="nav-link categories-dropdown-toggle" onClick={handleProductsClick}>
                  Products
                  <i className="fas fa-chevron-down dropdown-icon"></i>
                </NavLink>
                <ul className="dropdown-menu">
                  {categories.map(category => (
                      <li key={category} onClick={() => setMobileMenuOpen(false)}>
                        <NavLink to={`/products?category=${category.toLowerCase()}`}>
                            {category}
                        </NavLink>
                      </li>
                  ))}
                </ul>
              </li>
              <li><NavLink to="/about" className="nav-link">About</NavLink></li>
              <li><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
            </ul>
                
            <div className="nav-buttons">
              <button className="dark-mode-toggle" id="darkModeToggle" onClick={toggleTheme}>
                {theme === 'dark' ? <><i className="fas fa-sun"></i> Light</> : <><i className="far fa-moon"></i> Dark</>}
              </button>
              
              {!currentUser ? (
                <div className="auth-nav-state" id="loggedOutNavButtons">
                  <button className="btn btn-outline" onClick={() => setAuthModalOpen(true)}>Login</button>
                  <button className="btn btn-primary signup-trigger-btn" onClick={() => setAuthModalOpen(true)}>Sign Up</button>
                </div>
              ) : (
                <div className="auth-nav-state" id="loggedInNavButtons">
                  {currentUser.role === 'user' && (
                    <Link to="/cart" className="header-cart-link">
                      <i className="fas fa-shopping-cart"></i>
                      {cartItemCount > 0 && <span id="cartItemCount" style={{display: 'flex'}}>{cartItemCount}</span>}
                    </Link>
                  )}
                  {currentUser.role === 'admin' && ( <Link to="/admin" className="header-admin-link"><i className="fas fa-user-shield"></i> Admin</Link> )}
                  {currentUser.role !== 'admin' && ( <Link to="/profile" className="header-profile-link"><i className="fas fa-user-circle"></i> Profile</Link> )}
                  <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </nav>
          
          <div className="mobile-menu-btn" id="mobileMenuBtn" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </header>
      {isAuthModalOpen && <AuthModal closeModal={() => setAuthModalOpen(false)} />}
    </>
  );
};

export default Header;