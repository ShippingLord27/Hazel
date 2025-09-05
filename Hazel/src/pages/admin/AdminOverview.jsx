import React from 'react';
import { useApp } from '../../hooks/useApp';

const AdminOverview = () => {
    // FIX: Use `allProfiles` (an array) instead of `users` (which is gone).
    const { allProfiles, products } = useApp();

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Overview</h1></div>
            <div className="analytics-grid">
                <div className="analytics-card">
                    {/* FIX: Get the count from the array's length. */}
                    <div className="analytics-value">{allProfiles.length}</div>
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