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
    if (!isMobileMenuOpen) {
      setCategoriesOpen(false);
    }
  }, [isMobileMenuOpen]);

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
                <a className="nav-link categories-dropdown-toggle" onClick={(e) => { e.preventDefault(); setCategoriesOpen(!isCategoriesOpen); }}>
                  Products <i className="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><NavLink to="/products">All Products</NavLink></li>
                  {categories.map(category => (
                      <li key={category}><NavLink to="/products">{category}</NavLink></li>
                  ))}
                </ul>
              </li>
              <li><NavLink to="/about" className="nav-link">About</NavLink></li>
              <li><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
            </ul>
                
            <div className="nav-buttons">
              <button className="dark-mode-toggle" id="darkModeToggle" onClick={toggleTheme}>
                {theme === 'dark' ? <><i className="fas fa-sun"></i> Light mode</> : <><i className="far fa-moon"></i> Dark mode</>}
              </button>
              
              {!currentUser ? (
                <div className="auth-nav-state" id="loggedOutNavButtons">
                  <button className="btn btn-outline" onClick={() => setAuthModalOpen(true)}>Login</button>
                  <button className="btn btn-primary signup-trigger-btn" onClick={() => setAuthModalOpen(true)}>Sign Up</button>
                </div>
              ) : (
                <div className="auth-nav-state" id="loggedInNavButtons">
                  <Link to="/cart" className="header-cart-link">
                    <i className="fas fa-shopping-cart"></i>
                    {cartItemCount > 0 && <span id="cartItemCount" style={{display: 'flex'}}>{cartItemCount}</span>}
                  </Link>
                  {currentUser.isAdmin && ( <Link to="/admin" className="header-admin-link"><i className="fas fa-user-shield"></i> Admin</Link> )}
                  <Link to="/profile" className="header-profile-link"><i className="fas fa-user-circle"></i> Profile</Link>
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