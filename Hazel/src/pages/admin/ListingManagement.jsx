import React, { useMemo } from 'react';
import { useApp } from '../../hooks/useApp';

const ListingManagement = () => {
    // Bring in `allProfiles` and `isLoading` for our checks
    const { products, allProfiles, isLoading, updateProductStatus, deleteProduct } = useApp();

    // --- THE FIX: Create a safe way to find owner names ---
    // We use useMemo to create a lookup map from the allProfiles array.
    // This is more efficient than searching the array every time.
    // The key is the owner's email, and the value is their full name.
    const ownerIdToNameMap = useMemo(() => {
        if (!allProfiles || allProfiles.length === 0) {
            return {};
        }
        return allProfiles.reduce((acc, profile) => {
            // The product data uses email as ownerId, so we key our map by email.
            acc[profile.email] = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A';
            return acc;
        }, {});
    }, [allProfiles]);


    const handleDelete = (productId) => {
        if (window.confirm("ADMIN: Are you sure you want to PERMANENTLY delete this listing? This is irreversible.")) {
            deleteProduct(productId);
        }
    };

    // --- Bulletproof Loading Check ---
    if (isLoading) {
        return (
             <div className="admin-view">
                <div className="admin-view-header"><h1>Listing Management</h1></div>
                <p>Loading listings...</p>
            </div>
        );
    }

    return (
        <div className="admin-view">
            <div className="admin-view-header">
                <h1>Listing Management</h1>
                <p>Approve, reject, or delete user-submitted listings.</p>
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
                        {products.map(product => {
                            // Safely get the owner's name from our lookup map
                            const ownerName = ownerIdToNameMap[product.ownerId] || 'Unknown Owner';
                            
                            return (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>{ownerName}</td>
                                    <td><span className={`status-${product.status}`}>{product.status}</span></td>
                                    <td className="actions-cell">
                                        {product.status === 'pending' && (
                                            <>
                                                <button className="btn btn-success btn-small" onClick={() => updateProductStatus(product.id, 'approved')}>Approve</button>
                                                <button className="btn btn-danger btn-small" onClick={() => updateProductStatus(product.id, 'rejected')}>Reject</button>
                                            </>
                                        )}
                                        {product.status === 'rejected' && (
                                             <button className="btn btn-success btn-small" onClick={() => updateProductStatus(product.id, 'approved')}>Re-Approve</button>
                                        )}
                                         <button className="btn btn-secondary btn-small" onClick={() => handleDelete(product.id)}>Delete</button>
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