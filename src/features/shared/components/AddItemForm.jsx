import React, { useState } from 'react';
import '../../../styles/forms.css';

function AddItemForm({ itemType, onAdd, placeholder = "Enter title..." }) {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const isPhoto = itemType === 'Photo';

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (isPhoto && !imageUrl.trim()) return;
        
        setIsCreating(true);
        if (isPhoto) {
            await onAdd({
                title: title.trim(),
                url: imageUrl.trim(),
                thumbnailUrl: imageUrl.trim()
            });
        } else {
            await onAdd(title.trim());
        }
        setTitle('');
        setImageUrl('');
        setIsCreating(false);
    };

    return (
        <div className="create-item-section">
            <h3>Create New {itemType}</h3>
            <input
                type="text"
                placeholder={placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
            />
            {isPhoto && (
                <input
                    type="url"
                    placeholder="Image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isCreating}
                />
            )}
            <button
                onClick={handleSubmit}
                disabled={isCreating || !title.trim() || (isPhoto && !imageUrl.trim())}
            >
                {isCreating ? 'Creating...' : `Create ${itemType}`}
            </button>
        </div>
    );
}

export default AddItemForm;