
import React from 'react';
import { useApp } from '../../hooks/useApp';

const ListingManagement = () => {
    const { items, updateItemStatus, deleteItem, allProfiles } = useApp();

    const handleUpdateStatus = (itemId, status) => {
        updateItemStatus(itemId, status);
    };

    const handleDelete = (itemId) => {
        if (window.confirm("ADMIN: Are you sure you want to PERMANENTLY delete this listing? This is irreversible.")) {
            deleteItem(itemId);
        }
    }

    const getOwnerName = (ownerId) => {
        const owner = allProfiles.find(p => p.id === ownerId);
        return owner ? `${owner.firstName} ${owner.lastName}` : 'N/A';
    }

    const getOwnerEmail = (ownerId) => {
        const owner = allProfiles.find(p => p.id === ownerId);
        return owner ? owner.email : 'No Email';
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header">
                <h1>Listing Management</h1>
                <p>Manage item availability and delete listings.</p>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>
                                        {getOwnerName(item.ownerId)}
                                        <div className="admin-listing-owner-info">
                                            {getOwnerEmail(item.ownerId)} ({item.ownerId || 'No ID'})
                                        </div>
                                    </td>
                                    <td><span className={`status-${item.status}`}>{item.status}</span></td>
                                    <td className="admin-actions">
                                        <button onClick={() => handleUpdateStatus(item.id, 'approved')} className="btn btn-success btn-small">Accept</button>
                                        <button onClick={() => handleUpdateStatus(item.id, 'rejected')} className="btn btn-secondary btn-small">Reject</button>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-small">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListingManagement;
