
import React from 'react';
import { useApp } from '../../hooks/useApp';

const UserManagement = () => {
    const { allProfiles, isLoading, updateUserStatus, deleteUser } = useApp();

    if (isLoading || !allProfiles) {
        return <p>Loading user data...</p>;
    }

    const handleUpdateStatus = (userId, status) => {
        updateUserStatus(userId, status);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>User Management</h1></div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProfiles.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`status-${user.verification_status || 'unverified'}`}>
                                        {user.verification_status || 'unverified'}
                                    </span>
                                </td>
                                <td className="admin-actions">
                                    <button onClick={() => handleUpdateStatus(user.id, 'verified')} className="btn-accept">Accept</button>
                                    <button onClick={() => handleUpdateStatus(user.id, 'rejected')} className="btn-reject">Reject</button>
                                    <button onClick={() => handleDelete(user.id)} className="btn-delete">Delete</button>
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
