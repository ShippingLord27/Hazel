import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const AdminSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [settingsData, setSettingsData] = useState({
        firstName: '', lastName: '', profilePic: '',
        currentPassword: '', newPassword: '', confirmNewPassword: ''
    });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                profilePic: currentUser.profilePic,
                currentPassword: '', newPassword: '', confirmNewPassword: ''
            });
        }
    }, [currentUser]);

     const handleChange = (e) => {
        setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (settingsData.newPassword && settingsData.newPassword !== settingsData.confirmNewPassword) { showToast("New passwords do not match."); return; }
        if (settingsData.newPassword && currentUser.password !== settingsData.currentPassword) { showToast("Incorrect current password."); return; }
        
        const updates = {
            firstName: settingsData.firstName,
            lastName: settingsData.lastName,
            profilePic: settingsData.profilePic,
        };
        if (settingsData.newPassword) { updates.password = settingsData.newPassword; }
        
        updateUser(currentUser.email, updates);
        showToast("Admin settings updated successfully!");
        setSettingsData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Account Settings</h1></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>First Name*</label><input type="text" name="firstName" value={settingsData.firstName} onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name*</label><input type="text" name="lastName" value={settingsData.lastName} onChange={handleChange} required /></div>
                {/* FIX: Admin email remains readonly */}
                <div className="form-group"><label>Email</label><input type="email" value={currentUser.email} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profilePic" value={settingsData.profilePic} onChange={handleChange} /></div>
                <hr/>
                <h3>Change Password</h3>
                <div className="form-group"><label>Current Password</label><input type="password" name="currentPassword" value={settingsData.currentPassword} onChange={handleChange} /></div>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={settingsData.newPassword} onChange={handleChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={settingsData.confirmNewPassword} onChange={handleChange} /></div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminSettings;