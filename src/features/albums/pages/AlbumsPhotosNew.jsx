import { useState, useEffect, useCallback } from 'react';
import { useFetchApi } from '../../useFetchApi.js';
import { useAlbunsCache } from "../cache/albumsCash.jsx";
import { useParams } from 'react-router-dom';
import PhotoItem from '../components/PhotoItem.jsx';
import AddItemForm from '../../shared/components/AddItemForm.jsx';
import '../../../styles/photos.css';

function AlbumsPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 6;
    const { getData, postData, putData, deleteData } = useFetchApi();
    const { getPhotos, setPhotos: setCachedPhotos } = useAlbunsCache();
    const { albumId } = useParams();

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const savedCount = localStorage.getItem(`photosCount_${albumId}`);
            const totalToLoad = savedCount ? parseInt(savedCount) : limit;
            const data = await getData(`photos?albumId=${albumId}&_start=0&_limit=${totalToLoad}`);
            
            if (data && data.length > 0) {
                setPhotos(data);
            }
            if (!data || data.length < limit) {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddPhoto = async (photoData) => {
        const newPhoto = { 
            title: photoData.title, 
            url: photoData.url,
            thumbnailUrl: photoData.thumbnailUrl,
            albumId: parseInt(albumId),
        };
        const createdPhoto = await postData('photos', newPhoto);
        if (createdPhoto) {
            const updatedPhotos = [...photos, createdPhoto];
            setPhotos(updatedPhotos);
            setCachedPhotos(albumId, updatedPhotos);
        }
    };

    const handleUpdatePhoto = useCallback(async (updatedPhoto) => {
        const result = await putData(`photos/${updatedPhoto.id}`, updatedPhoto);
        if (result) {
            const updatedPhotos = photos.map(p => 
                p.id === updatedPhoto.id ? result : p
            );
            setPhotos(updatedPhotos);
            setCachedPhotos(albumId, updatedPhotos);
        }
    }, [putData, photos, setCachedPhotos, albumId]);

    const handleDeletePhoto = useCallback(async (id) => {
        const success = await deleteData(`photos/${id}`);
        if (success) {
            const updatedPhotos = photos.filter(p => p.id !== id);
            setPhotos(updatedPhotos);
            setCachedPhotos(albumId, updatedPhotos);
        }
    }, [deleteData, photos, setCachedPhotos, albumId]);

    useEffect(() => {
        if (albumId) {
            const savedCount = localStorage.getItem(`photosCount_${albumId}`);
            if (savedCount) {
                const totalPhotos = parseInt(savedCount);
                const totalPages = Math.ceil(totalPhotos / limit);
                setPage(totalPages - 1);
            }
            fetchPhotos();
        }
    }, [albumId]);

    useEffect(() => {
        if (albumId && page > 0) {
            fetchPhotos();
        }
    }, [page]);

    useEffect(() => {
        if (photos.length > 0) {
            localStorage.setItem(`photosCount_${albumId}`, photos.length.toString());
        }
    }, [photos.length, albumId]);

    return (
        <div className="photos-page">
            <div className="album-header">
                <h1>Album #{albumId}</h1>
                <div className="album-info">
                    {photos.length} Photos
                </div>
            </div>
            
            <AddItemForm 
                itemType="Photo"
                onAdd={handleAddPhoto}
                placeholder="Photo title..."
            />

            <div className="photos-grid">
                {photos.map((photo, index) => (
                    <PhotoItem 
                        key={photo.id}
                        photo={photo}
                        onUpdate={handleUpdatePhoto}
                        onDelete={handleDeletePhoto}
                        style={{"--index": index}}
                    />
                ))}
            </div>

            {loading && (
                <div className="loading-spinner">
                    <p>Loading photos...</p>
                </div>
            )}

            {!loading && hasMore && (
                <div className="load-more-container">
                    <button 
                        className="load-more-btn" 
                        onClick={() => {
                            const newPhotosCount = photos.length + limit;
                            localStorage.setItem(`photosCount_${albumId}`, newPhotosCount.toString());
                            setPage(prev => prev + 1);
                        }}
                    >
                        Load More Photos
                    </button>
                </div>
            )}

            {!loading && photos.length === 0 && (
                <div className="no-photos">
                    <p>📷 No photos found in this album</p>
                </div>
            )}
        </div>
    );
}

export default AlbumsPhotos;