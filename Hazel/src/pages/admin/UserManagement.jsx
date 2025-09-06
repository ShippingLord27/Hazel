import React from 'react';
import { useApp } from '../../hooks/useApp';

const UserManagement = () => {
    const { allProfiles, isLoading } = useApp();

    if (isLoading || !allProfiles) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header"><h1>User Management</h1></div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {allProfiles.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.verification_status || 'N/A'}</td>
                                <td className="actions-cell">
                                    {/* Action buttons can be re-enabled here once updateUser is fully built out */}
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