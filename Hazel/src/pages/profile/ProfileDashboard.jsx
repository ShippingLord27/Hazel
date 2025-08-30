import React from 'react';
import { useApp } from '../../hooks/useApp';

const OwnerDashboard = ({ user }) => (
    <>
        <div className="profile-view-header">
            <h1>Welcome, {user.firstName}!</h1>
            <p>Here's an overview of your rental activity.</p>
        </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">{user.myListingIds.length}</div>
                <div className="analytics-label">Total Listings</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">{user.activeRentalsCount}</div>
                <div className="analytics-label">Active Rentals</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">₱{user.totalEarningsAmount.toFixed(2)}</div>
                <div className="analytics-label">Total Earnings</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">{user.totalListingViews}</div>
                <div className="analytics-label">Listing Views</div>
            </div>
        </div>
    </>
);

const UserDashboard = ({ user }) => (
     <>
        <div className="profile-view-header">
            <h1>Welcome, {user.firstName}!</h1>
            <p>Here's a summary of your account.</p>
        </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">{user.favoriteListingIds.length}</div>
                <div className="analytics-label">Favorited Items</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">{user.activeRentalsCount}</div>
                <div className="analytics-label">Items Rented</div>
            </div>
        </div>
    </>
);


const ProfileDashboard = () => {
    const { currentUser, users } = useApp();

    // Get the most up-to-date user data from the master 'users' list.
    const freshUserData = currentUser ? users[currentUser.email] : null;

    if (!freshUserData) return null;

    return (
        <div className="profile-view">
           {freshUserData.role === 'owner' 
                ? <OwnerDashboard user={freshUserData} /> 
                : <UserDashboard user={freshUserData} />
           }
        </div>
    );
};

export default ProfileDashboard;