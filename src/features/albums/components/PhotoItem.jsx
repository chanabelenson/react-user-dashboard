import React from 'react';
import ItemActions from '../../shared/components/ItemActions.jsx';

function PhotoItem({ photo, onUpdate, onDelete }) {
    const getValidUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/150/cccccc';
        if (url.startsWith('http')) return url;
        if (url.includes('via.placeholder.com')) return `https://${url}`;
        return url;
    };

    return (
        <div className="photo-item">
            <img src={getValidUrl(photo.thumbnailUrl)} alt={photo.title} />
            <p>{typeof photo.title === 'string' ? photo.title : photo.title.title || 'No title'}</p>
            
            <ItemActions
                item={photo}
                itemType="photos"
                onUpdate={onUpdate}
                onDelete={onDelete}
                editFields={['title', 'url', 'thumbnailUrl']}
            />
        </div>
    );
}

export default PhotoItem;
