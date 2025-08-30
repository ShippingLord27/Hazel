import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';

const ListingModal = ({ productToEdit, closeModal }) => {
    const { addProduct, updateProduct, showToast, currentUser } = useApp();
    const isEditMode = Boolean(productToEdit);

    const initialFormState = {
        title: '', fullTitle: '', category: '', priceDisplay: '',
        image: '', description: '', trackingTagId: '', ownerTerms: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                title: productToEdit.title || '',
                fullTitle: productToEdit.fullTitle || '',
                category: productToEdit.category.toLowerCase() || '',
                priceDisplay: productToEdit.priceDisplay || '',
                image: productToEdit.image || '',
                description: productToEdit.description || '',
                trackingTagId: productToEdit.trackingTagId || '',
                ownerTerms: productToEdit.ownerTerms || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [productToEdit, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.fullTitle || !formData.category || !formData.priceDisplay || !formData.image || !formData.description || !formData.trackingTagId) {
            showToast("Please fill out all required fields.");
            return;
        }

        const priceMatch = formData.priceDisplay.match(/(\d+(\.\d+)?)/);
        if (!priceMatch) {
            showToast("Invalid price format. Use a format like '₱50/day'.");
            return;
        }
        const priceNumber = parseFloat(priceMatch[0]);

        const productData = {
            ...formData,
            price: priceNumber,
            category: formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
        };

        if (isEditMode) {
            updateProduct({ ...productToEdit, ...productData });
            showToast("Listing updated successfully!");
        } else {
            // Note: In a real app, an admin creating a listing would need to assign an owner.
            // For this simulation, it defaults to the admin.
            addProduct({
                ...productData,
                ownerId: currentUser.email,
                ownerName: `${currentUser.firstName} ${currentUser.lastName}`,
            });
            showToast("Listing created successfully!");
        }
        closeModal();
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button className="modal-close-btn" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group"><label>Title*</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Full Title*</label><input type="text" name="fullTitle" value={formData.fullTitle} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Category*</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="" disabled>Select</option><option value="tools">Tools</option><option value="electronics">Electronics</option><option value="vehicles">Vehicles</option><option value="party">Party</option><option value="sports">Sports</option><option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group"><label>Price (e.g., ₱100/day)*</label><input type="text" name="priceDisplay" value={formData.priceDisplay} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Image URL*</label><input type="url" name="image" value={formData.image} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Tracking Tag ID*</label><input type="text" name="trackingTagId" value={formData.trackingTagId} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Description*</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea></div>
                        <div className="form-group"><label>Custom Terms (Optional)</label><textarea name="ownerTerms" rows="3" value={formData.ownerTerms} onChange={handleChange}></textarea></div>
                        <button type="submit" className="btn btn-primary btn-block">{isEditMode ? 'Save Changes' : 'Create Listing'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ListingModal;