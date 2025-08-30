import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProfilePage = () => {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else if (currentUser.role === 'admin') {
            navigate('/admin');
        }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.role === 'admin') return null;

    // Define different menus for different roles
    const ownerMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "my-listings", icon: "fas fa-list", label: "My Listings" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];

    const userMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "favorites", icon: "fas fa-heart", label: "Favorites" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];
    
    const menuToRender = currentUser.role === 'owner' ? ownerMenu : userMenu;

    return (
        <div className="page active" id="profilePage" style={{ paddingTop: '70px' }}>
            <div className="container profile-page-main-container"> 
                <div className="profile-container">
                    <aside className="profile-sidebar">
                        <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
                        <h3>{currentUser.firstName} {currentUser.lastName}</h3>
                        <p>{currentUser.email}</p>
                        <ul className="sidebar-menu">
                            {menuToRender.map(item => (
                                <li key={item.path}>
                                    <NavLink to={item.path} end={item.end}>
                                        <i className={item.icon}></i> {item.label}
                                    </NavLink>
                                </li>
                            ))}
                            <li><a href="#" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
                        </ul>
                    </aside>
                    <main className="profile-main-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;