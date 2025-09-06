import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const AdminSettings = () => {
    const { currentUser, showToast, updateUser, isLoading } = useApp();
    // State to hold the form data
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        // When currentUser is loaded, populate the form
        if (currentUser && currentUser.profile) {
            setName(currentUser.profile.name || '');
            setProfilePic(currentUser.profile.profile_pic || '');
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.profile) {
            showToast("User data not available.", "error");
            return;
        }
        // Prepare the data with the correct database column names
        const updates = {
            name: name,
            profile_pic: profilePic
        };
        // Call the context's updateUser function
        updateUser(currentUser.id, currentUser.profile.role, updates);
    };

    if (isLoading || !currentUser) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Account Settings</h1></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name*</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={currentUser.email} readOnly />
                </div>
                 <div className="form-group">
                    <label>Profile Picture URL</label>
                    <input type="url" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
                </div>
                <hr/>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminSettings;