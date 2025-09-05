import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const AdminDashboardPage = () => {
    const { currentUser, isLoading, logout } = useApp(); // FIX: Get isLoading state
    const navigate = useNavigate();

    useEffect(() => {
        // FIX: Wait for loading to finish before checking the user
        if (!isLoading) {
            if (!currentUser || currentUser.role !== 'admin') {
                navigate('/');
            }
        }
    }, [currentUser, isLoading, navigate]);

    // FIX: Show a loading state
    if (isLoading || !currentUser) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
    }
    
    // This part is for when the user is confirmed to be an admin
    return (
        <div className="page active" id="adminDashboardPage" style={{ paddingTop: '70px' }}>
            <div className="container admin-dashboard-container">
                <aside className="admin-sidebar">
                    <img src={currentUser.profile_pic} alt="Admin" id="adminSidebarPic" />
                    <h3>{currentUser.first_name} {currentUser.last_name}</h3>
                    <p>{currentUser.email}</p>
                    <ul className="sidebar-menu">
                        <li><NavLink to="/admin" end><i className="fas fa-chart-line"></i> Overview</NavLink></li>
                        <li><NavLink to="/admin/users"><i className="fas fa-users-cog"></i> User Management</NavLink></li>
                        <li><NavLink to="/admin/listings"><i className="fas fa-tasks"></i> Listing Management</NavLink></li>
                        <li><NavLink to="/admin/content"><i className="fas fa-file-alt"></i> Content Templates</NavLink></li>
                        <li><NavLink to="/admin/settings"><i className="fas fa-user-cog"></i> Admin Settings</NavLink></li>
                        <li><a href="#" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </aside>
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;