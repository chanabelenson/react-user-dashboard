import React, { createContext, useState, useContext } from 'react';

const albunsCacheContext = createContext();

export const AlbunsCacheProvider = ({ children }) => {
    const [albunsCache, setAlbunsCache] = useState({});
    const [photosCache, setPhotosCache] = useState({});

    const getAlbums = (userId) => {
        return albunsCache[userId] || null;
    };

    const setAlbumsCash = (userId, albuns) => {
        setAlbunsCache({
            ...albunsCache,
            [userId]: albuns
        });
    };

    const getPhotos = (albumId) => {
        return photosCache[albumId] || null;
    };

    const setPhotos = (albumId, photos) => {
        setPhotosCache({
            ...photosCache,
            [albumId]: photos
        });
    };

    const clearCache = () => {
        setAlbunsCache({});
        setPhotosCache({});
    };
    
    return (
        <albunsCacheContext.Provider value={{ getAlbums, setAlbumsCash, getPhotos, setPhotos, clearCache }}>
            {children}
        </albunsCacheContext.Provider>
    );
};

export const useAlbunsCache = () => {
    const context = useContext(albunsCacheContext);
    if (!context) {
        throw new Error('useAlbunsCache must be used within a AlbunsCacheProvider');
    }
    return context;
};