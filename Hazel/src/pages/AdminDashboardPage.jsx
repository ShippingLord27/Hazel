import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const AdminDashboardPage = () => {
    const { currentUser, isLoading, logout } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        // This logic correctly checks the nested profile role
        if (!isLoading && (!currentUser || currentUser.profile?.role !== 'admin')) {
            navigate('/');
        }
    }, [currentUser, isLoading, navigate]);

    // This guard clause prevents rendering with incomplete data
    if (isLoading || !currentUser || !currentUser.profile) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Authorizing...</div>;
    }
    
    return (
        <div className="page active" id="adminDashboardPage" style={{ paddingTop: '70px' }}>
            <div className="container admin-dashboard-container">
                <aside className="admin-sidebar">
                    {/* --- THE FIX --- */}
                    {/* Use the new, correct data structure */}
                    <img src={currentUser.profile.profile_pic || 'https://i.ibb.co/HT0Nz7j1/download-12.jpg'} alt="Admin" id="adminSidebarPic" />
                    <h3>{currentUser.profile.name}</h3>
                    <p>{currentUser.email}</p>
                    <ul className="sidebar-menu">
                        <li><NavLink to="/admin" end><i className="fas fa-chart-line"></i> Overview</NavLink></li>
                        <li><NavLink to="/admin/users"><i className="fas fa-users-cog"></i> User Management</NavLink></li>
                        <li><NavLink to="/admin/listings"><i className="fas fa-tasks"></i> Listing Management</NavLink></li>
                        {/* We remove content management for now to simplify */}
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