import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const ProfilePage = () => {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else if (currentUser.isAdmin) {
            navigate('/admin');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    return (
        <div className="page active" id="profilePage" style={{ paddingTop: '70px' }}>
            <div className="container profile-page-main-container"> 
                <div className="profile-container">
                    <aside className="profile-sidebar">
                        <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
                        <h3>{currentUser.firstName} {currentUser.lastName}</h3>
                        <p>{currentUser.email}</p>
                        <ul className="sidebar-menu">
                            <li><NavLink to="/profile" end><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
                            <li><NavLink to="/profile/my-listings"><i className="fas fa-list"></i> My Listings</NavLink></li>
                            <li><NavLink to="/profile/favorites"><i className="fas fa-heart"></i> Favorites</NavLink></li>
                            <li><NavLink to="/profile/rental-tracker"><i className="fas fa-route"></i> Rental Tracker</NavLink></li>
                            <li><NavLink to="/profile/settings"><i className="fas fa-cog"></i> Settings</NavLink></li>
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