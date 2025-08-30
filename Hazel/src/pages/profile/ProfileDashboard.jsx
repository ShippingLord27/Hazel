import React from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileDashboard = () => {
    const { currentUser, users } = useApp();

    // Get the most up-to-date user data from the master 'users' list.
    const freshUserData = currentUser ? users[currentUser.email] : null;

    if (!freshUserData) return null;

    return (
        <div className="profile-view">
            <div className="profile-view-header">
                <h1>Welcome, {freshUserData.firstName}!</h1>
                <p>Here's an overview of your rental activity.</p>
            </div>
            <div className="analytics-grid">
                <div className="analytics-card">
                    {/* Use the length of the ID list from the fresh user data */}
                    <div className="analytics-value">{freshUserData.myListingIds.length}</div>
                    <div className="analytics-label">Total Listings</div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-value">{freshUserData.activeRentalsCount}</div>
                    <div className="analytics-label">Active Rentals</div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-value">₱{freshUserData.totalEarningsAmount.toFixed(2)}</div>
                    <div className="analytics-label">Total Earnings</div>
                </div>
                 <div className="analytics-card">
                    <div className="analytics-value">{freshUserData.totalListingViews}</div>
                    <div className="analytics-label">Listing Views</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;