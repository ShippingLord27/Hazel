import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProfilePage = () => {
    const { currentUser, isLoading, logout } = useApp(); // FIX: Get isLoading state
    const navigate = useNavigate();

    useEffect(() => {
        // FIX: Wait for loading to finish before checking the user
        if (!isLoading) {
            if (!currentUser) {
                navigate('/');
            } else if (currentUser.role === 'admin') {
                navigate('/admin');
            }
        }
    }, [currentUser, isLoading, navigate]);

    // FIX: Show a loading state
    if (isLoading || !currentUser) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Profile...</div>;
    }
    
    // This part is for when the user is confirmed to be logged in
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
                        <img src={currentUser.profile_pic} alt="Profile" className="profile-pic" />
                        <h3>{currentUser.first_name} {currentUser.last_name}</h3>
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