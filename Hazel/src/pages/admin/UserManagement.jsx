import React from 'react';
import { useApp } from '../../hooks/useApp';

const UserManagement = () => {
    // FIX: Use `allProfiles` array. The updateUser function now requires the user's UUID (id).
    const { allProfiles, updateUser, showToast } = useApp();

    const handleVerification = (userId, status) => {
        // We pass the user's UUID (id) and the data to update.
        updateUser(userId, { verification_status: status });
        showToast(`Verification status has been updated to ${status}.`);
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>User Management</h1></div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {/* FIX: Iterate over `allProfiles` array */}
                        {allProfiles.map(profile => (
                            <tr key={profile.id}>
                                {/* FIX: Use snake_case properties from the database */}
                                <td>{profile.first_name} {profile.last_name}</td>
                                <td>{profile.email}</td>
                                <td>{profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'N/A'}</td>
                                <td><span className={`status-${profile.verification_status}`}>{profile.verification_status}</span></td>
                                <td className="actions-cell">
                                    {profile.verification_status === 'pending' && profile.role !== 'admin' && (
                                        <>
                                            <button className="btn btn-success btn-small" onClick={() => handleVerification(profile.id, 'verified')}>Approve</button>
                                            <button className="btn btn-danger btn-small" onClick={() => handleVerification(profile.id, 'unverified')}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;