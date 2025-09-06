import React from 'react';
import { useApp } from '../../hooks/useApp';

const OwnerDashboard = ({ profile }) => (
    <>
        <div className="profile-view-header">
            {/* --- THE FIX --- */}
            <h1>Welcome, {profile.name}!</h1>
            <p>Here's an overview of your rental activity.</p>
        </div>
        <div className="analytics-grid">
            {/* Note: These stats are placeholders until the items table is moved to Supabase */}
            <div className="analytics-card"><div className="analytics-value">0</div><div className="analytics-label">Total Listings</div></div>
            <div className="analytics-card"><div className="analytics-value">0</div><div className="analytics-label">Items Rented Out</div></div>
            <div className="analytics-card"><div className="analytics-value">₱0.00</div><div className="analytics-label">Total Earnings</div></div>
        </div>
    </>
);

const RenterDashboard = ({ profile }) => (
     <>
        <div className="profile-view-header">
            {/* --- THE FIX --- */}
            <h1>Welcome, {profile.name}!</h1>
            <p>Here's a summary of your account.</p>
        </div>
         <div className="analytics-grid">
            {/* Note: These stats are placeholders */}
            <div className="analytics-card"><div className="analytics-value">0</div><div className="analytics-label">Favorited Items</div></div>
            <div className="analytics-card"><div className="analytics-value">0</div><div className="analytics-label">Active Rentals</div></div>
        </div>
    </>
);

const ProfileDashboard = () => {
    const { currentUser, isLoading } = useApp();

    if (isLoading || !currentUser || !currentUser.profile) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="profile-view">
           {/* --- THE FIX --- */}
           {currentUser.profile.role === 'owner' 
                ? <OwnerDashboard profile={currentUser.profile} /> 
                : <RenterDashboard profile={currentUser.profile} />
           }
        </div>
    );
};

export default ProfileDashboard;