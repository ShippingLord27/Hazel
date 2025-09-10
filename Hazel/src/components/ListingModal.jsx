
import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';

const ListingModal = ({ itemToEdit, closeModal }) => {
    const { addItem, updateItem, showToast, categories, tags: allTags } = useApp();
    const isEditMode = Boolean(itemToEdit);

    const initialFormState = {
        title: '',
        categoryId: '',
        price_per_day: '',
        image_url: '',
        description: '',
        tags: '' // Comma-separated string for input
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEditMode && itemToEdit) {
            const category = categories.find(c => c.name === itemToEdit.category);
            setFormData({
                title: itemToEdit.title || '',
                categoryId: category ? category.id : '',
                price_per_day: itemToEdit.price_per_day ? String(itemToEdit.price_per_day) : '',
                image_url: itemToEdit.image_url || '',
                description: itemToEdit.description || '',
                tags: itemToEdit.tags ? itemToEdit.tags.join(', ') : ''
            });
        } else {
            setFormData(initialFormState);
        }
    }, [itemToEdit, isEditMode, categories]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const getTagIds = (tagString) => {
        if (!tagString.trim()) return [];
        const tagNames = tagString.split(',').map(t => t.trim().toLowerCase());
        return tagNames.map(name => {
            const existingTag = allTags.find(t => t.name.toLowerCase() === name);
            return existingTag ? existingTag.id : null; // In a real app, you might want to create new tags
        }).filter(Boolean);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.categoryId || !formData.price_per_day || !formData.image_url || !formData.description) {
            showToast("Please fill out all required fields marked with *.");
            return;
        }
        
        const priceNumber = parseFloat(formData.price_per_day);
        if (isNaN(priceNumber) || priceNumber <= 0) {
            showToast("Please enter a valid positive number for the price.");
            return;
        }

        const itemData = {
            title: formData.title,
            categoryId: formData.categoryId,
            price_per_day: priceNumber,
            image_url: formData.image_url,
            description: formData.description,
            tags: getTagIds(formData.tags),
        };

        if (isEditMode) {
            updateItem(itemToEdit.id, itemData);
        } else {
            addItem(itemData);
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
                        <div className="form-group"><label>Category*</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                                <option value="" disabled>Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price per day ($)*</label>
                            <input type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} required placeholder="25.00" step="0.01" min="0.01" />
                        </div>
                        <div className="form-group"><label>Image URL*</label><input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Tags (comma-separated)</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} /></div>
                        <div className="form-group"><label>Description*</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea></div>
                        <button type="submit" className="btn btn-primary btn-block">{isEditMode ? 'Save Changes' : 'Submit Listing'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ListingModal;
