import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProfilePage = () => {
    const { currentUser, isLoading, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!currentUser) {
                navigate('/');
            } else if (currentUser.profile?.role === 'admin') {
                navigate('/admin');
            }
        }
    }, [currentUser, isLoading, navigate]);

    // FIX: Create an async handler to properly await logout before navigating
    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    if (isLoading || !currentUser || !currentUser.profile) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Profile...</div>;
    }

    const ownerMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "my-listings", icon: "fas fa-list", label: "My Listings" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];

    const renterMenu = [
        { path: "/profile", end: true, icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "favorites", icon: "fas fa-heart", label: "Favorites" },
        { path: "rental-tracker", icon: "fas fa-route", label: "Rental Tracker" },
        { path: "settings", icon: "fas fa-cog", label: "Settings" }
    ];
    
    // --- THE FIX ---
    const menuToRender = currentUser.profile.role === 'owner' ? ownerMenu : renterMenu;

    return (
        <div className="page active" id="profilePage" style={{ paddingTop: '70px' }}>
            <div className="container profile-page-main-container"> 
                <div className="profile-container">
                    <aside className="profile-sidebar">
                        {/* --- THE FIX --- */}
                        <img src={currentUser.profile.profile_pic || 'https://i.ibb.co/HT0Nz7j1/download-12.jpg'} alt="Profile" className="profile-pic" />
                        <h3>{currentUser.profile.name}</h3>
                        <p>{currentUser.email}</p>
                        <ul className="sidebar-menu">
                            {menuToRender.map(item => (
                                <li key={item.path}>
                                    <NavLink to={item.path} end={item.end}>
                                        <i className={item.icon}></i> {item.label}
                                    </NavLink>
                                </li>
                            ))}
                            <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
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