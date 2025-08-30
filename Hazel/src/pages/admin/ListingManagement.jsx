import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import ListingModal from '../../components/ListingModal';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
    const { users } = useApp();
    const owner = users[product.ownerId];
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.priceDisplay}</div>
                <div className="product-meta profile-card-meta">
                    <button className="btn btn-outline btn-small" onClick={() => onEdit(product)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => onDelete(product.id)}><i className="fas fa-trash"></i> Delete</button>
                </div>
                <div className="admin-listing-owner-info" title={owner?.email}>Owner: {owner ? `${owner.firstName} ${owner.lastName}` : 'N/A'}</div>
            </div>
        </div>
    );
};

const ListingManagement = () => {
    const { products, deleteProduct } = useApp();
    const [isListingModalOpen, setListingModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const handleEditListing = (product) => {
        setProductToEdit(product);
        setListingModalOpen(true);
    };

    const handleDeleteListing = (productId) => {
        if (window.confirm("ADMIN: Are you sure you want to PERMANENTLY delete this listing?")) {
            deleteProduct(productId);
        }
    };
    
    return (
        <>
            <div className="admin-view">
                <div className="admin-view-header"><h1>Listing Management</h1></div>
                <div className="products-grid">
                    {products.map(p => (
                        <AdminProductCard key={p.id} product={p} onEdit={handleEditListing} onDelete={handleDeleteListing} />
                    ))}
                </div>
            </div>
            {isListingModalOpen && (
                <ListingModal 
                    productToEdit={productToEdit} 
                    closeModal={() => setListingModalOpen(false)}
                />
            )}
        </>
    );
};

export default ListingManagement;