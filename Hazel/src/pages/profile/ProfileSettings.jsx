import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser, isLoading } = useApp();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (currentUser && currentUser.profile) {
            setName(currentUser.profile.name || '');
            setPhone(currentUser.profile.phone || '');
            setAddress(currentUser.profile.address || '');
        }
    }, [currentUser]);

    const handleSaveChanges = (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.profile) return;
        
        // Prepare data with correct database column names
        const updates = {
            name: name,
            phone: phone,
            address: address
        };
        
        updateUser(currentUser.id, currentUser.profile.role, updates);
    };

    if (isLoading || !currentUser || !currentUser.profile) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group">
                    <label>Full Name*</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={currentUser.email} readOnly />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                 <div className="form-group">
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <hr/>
                {/* Password change would require Supabase's updatePassword function,
                    which is more complex. We'll leave it out for now to ensure this part works. */}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;