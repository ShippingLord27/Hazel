import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import HistoryTracker from './HistoryTracker';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [settingsData, setSettingsData] = useState({
        name: '',
        profile_pic: null,
        location: ''
    });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                name: currentUser.name || '',
                profile_pic: currentUser.profile_pic || null,
                location: currentUser.location || ''
            });
        }
    }, [currentUser]);

    const handleSettingsChange = (e) => {
        if (e.target.name === 'profile_pic') {
            setSettingsData({ ...settingsData, profile_pic: e.target.files[0] });
        } else {
            setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await updateUser(currentUser.uid, settingsData);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast('Error updating profile. Please try again.', 'error');
        }
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group">
                    <label>Full Name*</label>
                    <input type="text" name="name" value={settingsData.name} onChange={handleSettingsChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={currentUser?.email || ''} readOnly />
                </div>
                <div className="form-group">
                    <label>Profile Picture</label>
                    <input type="file" name="profile_pic" onChange={handleSettingsChange} />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={settingsData.location} onChange={handleSettingsChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Update Info</button>
                </div>
            </form>

            <HistoryTracker />
        </div>
    );
};

export default ProfileSettings;