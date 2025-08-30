import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [settingsData, setSettingsData] = useState({
        firstName: '', lastName: '', profilePic: '', location: '',
        currentPassword: '', newPassword: '', confirmNewPassword: ''
    });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                profilePic: currentUser.profilePic,
                location: currentUser.location,
                currentPassword: '', newPassword: '', confirmNewPassword: ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (settingsData.newPassword && settingsData.newPassword !== settingsData.confirmNewPassword) {
            showToast("New passwords do not match.");
            return;
        }
        if (settingsData.newPassword && currentUser.password !== settingsData.currentPassword) {
            showToast("Incorrect current password.");
            return;
        }
        
        const updates = {
            firstName: settingsData.firstName,
            lastName: settingsData.lastName,
            profilePic: settingsData.profilePic,
            location: settingsData.location,
        };
        if (settingsData.newPassword) {
            updates.password = settingsData.newPassword;
        }
        
        updateUser(currentUser.email, updates);
        showToast("Settings updated successfully!");
        setSettingsData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    };

    const handleVerificationSubmit = () => {
        showToast('Simulating verification process...', 4000);
        setTimeout(() => {
            updateUser(currentUser.email, { verificationStatus: 'pending' });
            showToast('Verification submitted for review!');
        }, 4000);
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSubmit}>
                <h3>Personal Information</h3>
                <div className="form-group"><label>First Name*</label><input type="text" name="firstName" value={settingsData.firstName} onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name*</label><input type="text" name="lastName" value={settingsData.lastName} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={currentUser.email} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profilePic" value={settingsData.profilePic} onChange={handleChange} /></div>
                <div className="form-group"><label>Location</label><input type="text" name="location" value={settingsData.location} onChange={handleChange} /></div>
                <hr/>
                <h3>Identity Verification</h3>
                <div>
                    <p>Your current status is: <span className={`status-${currentUser.verificationStatus}`}>{currentUser.verificationStatus}</span></p>
                    {currentUser.verificationStatus === 'unverified' && (
                        <div>
                            <div className="form-group"><label>Upload a valid ID (mock):</label><input type="file" /></div>
                            <button type="button" className="btn btn-outline" onClick={handleVerificationSubmit}>Submit for Verification</button>
                        </div>
                    )}
                </div>
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

export default ProfileSettings;