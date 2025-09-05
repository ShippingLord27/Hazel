import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();
    const [formData, setFormData] = useState({ first_name: '', last_name: '', profile_pic: '' });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                profile_pic: currentUser.profile_pic || '',
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        if (!currentUser) {
            showToast("You must be logged in to save changes.");
            return;
        }
        // We only send the fields that can be changed here.
        // Role and email are not changed in this form.
        updateUser(currentUser.id, {
            first_name: formData.first_name,
            last_name: formData.last_name,
            profile_pic: formData.profile_pic
        });
    };

    if (!currentUser) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group"><label>First Name*</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name*</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={currentUser.email} readOnly /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profile_pic" value={formData.profile_pic} onChange={handleChange} /></div>
                <hr/>
                {/* Note: Password changes and other sections would be added here */}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;