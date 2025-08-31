import React from 'react';
import { useApp } from '../../hooks/useApp';

const ListingManagement = () => {
    const { products, users, updateProductStatus, deleteProduct } = useApp();

    const handleDelete = (productId) => {
        if (window.confirm("ADMIN: Are you sure you want to PERMANENTLY delete this listing? This is irreversible.")) {
            deleteProduct(productId);
        }
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
                            const owner = users[product.ownerId];
                            return (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>{owner ? `${owner.firstName} ${owner.lastName}` : 'N/A'}</td>
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