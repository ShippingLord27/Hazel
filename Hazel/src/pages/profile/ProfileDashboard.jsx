import React from 'react';
import { useApp } from '../../hooks/useApp';

// NOTE: The dashboard stats are placeholders for now.
// In a real app, this data would need to be calculated from rental history, etc.
const OwnerDashboard = ({ user }) => (
    <>
        <div className="profile-view-header">
            <h1>Welcome, {user.first_name}!</h1>
            <p>Here's an overview of your rental activity.</p>
        </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">0</div>
                <div className="analytics-label">Total Listings</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">0</div>
                <div className="analytics-label">Items Currently Rented Out</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">₱0.00</div>
                <div className="analytics-label">Total Earnings</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">0</div>
                <div className="analytics-label">Listing Views</div>
            </div>
        </div>
    </>
);

const UserDashboard = ({ user }) => (
     <>
        <div className="profile-view-header">
            <h1>Welcome, {user.first_name}!</h1>
            <p>Here's a summary of your account.</p>
        </div>
        <div className="analytics-grid">
            <div className="analytics-card">
                <div className="analytics-value">0</div>
                <div className="analytics-label">Favorited Items</div>
            </div>
            <div className="analytics-card">
                <div className="analytics-value">0</div>
                <div className="analytics-label">Active Rentals</div>
            </div>
        </div>
    </>
);

const ProfileDashboard = () => {
    const { currentUser } = useApp();

    // FIX: Directly use the currentUser object from the context.
    // It already has all the profile information. No lookup is needed.
    if (!currentUser) {
        return <p>Loading dashboard...</p>; // Or some other loading state
    }

    return (
        <div className="profile-view">
           {currentUser.role === 'owner' 
                ? <OwnerDashboard user={currentUser} /> 
                : <UserDashboard user={currentUser} />
           }
        </div>
    );
};

export default ProfileDashboard;