import React, { useState } from 'react';
import '../../../styles/item-actions.css';

function ItemActions({ item, itemType, onUpdate, onDelete, editFields = ['title'] }) {
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEdit = () => {
        setEditingItem({ ...item });
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        if (onUpdate) {
            await onUpdate(editingItem);
        }
        setEditingItem(null);
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        if (onDelete) {
            await onDelete(item.id);
        }
        setIsDeleting(false);
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="item-actions">
                <button 
                    className="edit-btn" 
                    onClick={handleEdit}
                    title={`Edit ${itemType.slice(0, -1)}`}
                >
                    ✏️
                </button>
                
                <button 
                    className="delete-btn" 
                    onClick={() => setShowDeleteModal(true)}
                    title={`Delete ${itemType.slice(0, -1)}`}
                >
                    ❌
                </button>
            </div>

            {editingItem && (
                <div className="edit-section">
                    <h4>Edit {itemType.slice(0, -1)}</h4>
                    {editFields.map(field => (
                        <div key={field} className="field-group">
                            <label>{field}:</label>
                            <input 
                                className="edit-input"
                                value={editingItem[field] || ''}
                                onChange={(e) => setEditingItem({...editingItem, [field]: e.target.value})}
                            />
                        </div>
                    ))}
                    <button 
                        className="update-btn"
                        onClick={handleUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                    <button 
                        className="cancel-btn"
                        onClick={() => setEditingItem(null)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {showDeleteModal && (
                <div className="delete-section">
                    <p>Are you sure you want to delete this {itemType.slice(0, -1)}?</p>
                    <button 
                        className="confirm-delete-btn"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button 
                        className="cancel-btn"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </>
    );
}

export default ItemActions;