import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const AdminSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [settingsData, setSettingsData] = useState({
        name: '', profilePic: '',
        newPassword: '', confirmNewPassword: ''
    });

    useEffect(() => {
        if (currentUser?.profile) {
            setSettingsData({
                name: currentUser.profile.name || '',
                profilePic: currentUser.profile.profile_pic,
                newPassword: '', confirmNewPassword: ''
            });
        }
    }, [currentUser]);

     const handleChange = (e) => {
        setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (settingsData.newPassword && settingsData.newPassword !== settingsData.confirmNewPassword) { showToast("New passwords do not match."); return; }
        
        const [firstName, ...lastNameParts] = settingsData.name.split(' ');
        const lastName = lastNameParts.join(' ');

        const updates = {
            firstName: firstName,
            lastName: lastName,
            profilePic: settingsData.profilePic,
        };
        if (settingsData.newPassword) { updates.password = settingsData.newPassword; }
        
        updateUser(currentUser.id, updates);
        showToast("Admin settings updated successfully!");
        setSettingsData(prev => ({ ...prev, newPassword: '', confirmNewPassword: '' }));
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>Admin Account Settings</h1></div>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Full Name*</label><input type="text" name="name" value={settingsData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={currentUser?.email || ''} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profilePic" value={settingsData.profilePic} onChange={handleChange} /></div>
                <hr/>
                <h3>Change Password</h3>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={settingsData.newPassword} onChange={handleChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={settingsData.confirmNewPassword} onChange={handleChange} /></div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminSettings;