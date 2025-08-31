import React from 'react';
import { useApp } from '../../hooks/useApp';

const UserManagement = () => {
    const { users, updateUser, showToast } = useApp();

    const handleVerification = (email, status) => {
        updateUser(email, { verificationStatus: status });
        showToast(`Verification for ${email} has been set to ${status}.`);
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>User Management</h1></div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {Object.values(users).map(user => (
                            <tr key={user.email}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                <td><span className={`status-${user.verificationStatus}`}>{user.verificationStatus}</span></td>
                                <td className="actions-cell">
                                    {user.verificationStatus === 'pending' && user.role !== 'admin' && (
                                        <>
                                            <button className="btn btn-success btn-small" onClick={() => handleVerification(user.email, 'verified')}>Approve</button>
                                            <button className="btn btn-danger btn-small" onClick={() => handleVerification(user.email, 'unverified')}>Reject</button>
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