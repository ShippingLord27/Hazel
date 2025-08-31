import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';

const ProfileSettings = () => {
    const { currentUser, showToast, updateUser } = useApp();

    const [settingsData, setSettingsData] = useState({ firstName: '', lastName: '', profilePic: '', location: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [paymentData, setPaymentData] = useState({ cardNumber: '', expiryDate: '', cvv: '' });

    useEffect(() => {
        if (currentUser) {
            setSettingsData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                profilePic: currentUser.profilePic || '',
                location: currentUser.location || '',
                email: currentUser.email || '',
            });
            // FIX: Correctly check for paymentInfo on the currentUser object
            if (currentUser.paymentInfo) {
                setPaymentData({
                    cardNumber: currentUser.paymentInfo.cardNumber || '',
                    expiryDate: currentUser.paymentInfo.expiryDate || '',
                    cvv: currentUser.paymentInfo.cvv || ''
                });
            }
        }
    }, [currentUser]);

    const handleSettingsChange = (e) => setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const handlePaymentChange = (e) => setPaymentData({ ...paymentData, [e.target.name]: e.target.value });

    const handleSaveChanges = (e) => {
        e.preventDefault();
        const originalEmail = currentUser.email;
        const updates = { ...settingsData };
        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmNewPassword) { showToast("New passwords do not match."); return; }
            if (currentUser.password !== passwordData.currentPassword) { showToast("Incorrect current password."); return; }
            updates.password = passwordData.newPassword;
        }
        if (currentUser.role === 'user') { updates.paymentInfo = paymentData; }
        updateUser(originalEmail, updates);
        showToast("Settings updated successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    const handleVerificationSubmit = () => {
        showToast('Simulating ID verification...', 2000);
        setTimeout(() => {
            updateUser(currentUser.email, { verificationStatus: 'pending' });
            showToast('ID submitted for review!');
        }, 2000);
    };

    const handleFaceScan = () => {
        showToast('Initializing face scan... (mock)', 3000);
        setTimeout(() => {
            showToast('Face scan complete. Submitting for review...');
            updateUser(currentUser.email, { verificationStatus: 'pending' });
        }, 3000);
    };

    return (
        <div className="profile-view">
            <div className="profile-view-header"><h1>Settings</h1></div>
            <form onSubmit={handleSaveChanges}>
                <h3>Personal Information</h3>
                <div className="form-group"><label>First Name*</label><input type="text" name="firstName" value={settingsData.firstName} onChange={handleSettingsChange} required /></div>
                <div className="form-group"><label>Last Name*</label><input type="text" name="lastName" value={settingsData.lastName} onChange={handleSettingsChange} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={settingsData.email} onChange={handleSettingsChange} required /></div>
                <div className="form-group"><label>Profile Picture URL</label><input type="url" name="profilePic" value={settingsData.profilePic} onChange={handleSettingsChange} /></div>
                <div className="form-group"><label>Location</label><input type="text" name="location" value={settingsData.location} onChange={handleSettingsChange} /></div>
                <hr/>
                {/* FIX: Correctly show verification section to owners */}
                {currentUser.role === 'owner' && (
                    <>
                        <h3>Identity Verification</h3>
                        <div id="verificationStatus">
                            <p>Your current status is: <span className={`status-${currentUser.verificationStatus}`}>{currentUser.verificationStatus}</span></p>
                            {currentUser.verificationStatus === 'unverified' && (
                                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <button type="button" className="btn btn-outline" onClick={handleVerificationSubmit}>Submit ID</button>
                                    <button type="button" className="btn btn-primary" onClick={handleFaceScan}>Start Face Scan (Mock)</button>
                                </div>
                            )}
                        </div>
                        <hr/>
                    </>
                )}
                {/* FIX: Correctly show payment section to users */}
                {currentUser.role === 'user' && (
                    <>
                        <h3>Payment Information</h3>
                        <p>Save your payment details for faster checkouts.</p>
                        <div className="form-group"><label>Card Number</label><input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} /></div>
                        <div className="form-group-row">
                            <div className="form-group"><label>Expiry Date (MM/YY)</label><input type="text" name="expiryDate" value={paymentData.expiryDate} onChange={handlePaymentChange} /></div>
                            <div className="form-group"><label>CVV</label><input type="text" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} /></div>
                        </div>
                        <hr/>
                    </>
                )}
                <h3>Change Password</h3>
                <div className="form-group"><label>Current Password</label><input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} /></div>
                <div className="form-group"><label>New Password</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} /></div>
                <button type="submit" className="btn btn-primary">Save All Changes</button>
            </form>
        </div>
    );
};

export default ProfileSettings;