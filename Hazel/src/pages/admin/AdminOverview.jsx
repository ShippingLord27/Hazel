import React from 'react';
import { useApp } from '../../hooks/useApp';

const AdminOverview = () => {
    const { users, products } = useApp();
    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Overview</h1></div>
            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-value">{Object.keys(users).length}</div>
                    <div className="analytics-label">Total Users</div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-value">{products.length}</div>
                    <div className="analytics-label">Total Listings</div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;