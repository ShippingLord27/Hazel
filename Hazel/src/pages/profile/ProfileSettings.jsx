import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser, updateUserPassword } = useApp();

    const [settingsData, setSettingsData] = useState({ name: '', profile_pic_url: '', location: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmNewPassword: '' });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim(),
                profile_pic_url: currentUser.profile_pic_url || '',
                location: currentUser.location || '',
                phone: currentUser.phone || '',
            });
        }
    }, [currentUser]);

    const handleSettingsChange = (e) => setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const [firstName, ...lastNameParts] = settingsData.name.split(' ');
        const lastName = lastNameParts.join(' ');

        const updates = {
            first_name: firstName,
            last_name: lastName,
            profile_pic_url: settingsData.profile_pic_url,
            location: settingsData.location,
            phone: settingsData.phone,
        };
        
        await updateUser(currentUser.uid, updates);
        
        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                showToast("New passwords do not match.");
                return;
            }
            await updateUserPassword(passwordData.newPassword);
            setPasswordData({ newPassword: '', confirmNewPassword: '' });
        }
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group"><label>Full Name*</label><input type="text" name="name" value={settingsData.name} onChange={handleSettingsChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={currentUser?.email || ''} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profile_pic_url" value={settingsData.profile_pic_url} onChange={handleSettingsChange} /></div>
                <div className="form-group"><label>Location</label><input type="text" name="location" value={settingsData.location} onChange={handleSettingsChange} /></div>
                <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={settingsData.phone} onChange={handleSettingsChange} /></div>
                <hr/>
                <h3>Change Password</h3>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} /></div>
                <button type="submit" className="btn btn-primary">Save All Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;