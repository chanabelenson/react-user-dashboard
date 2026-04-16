import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { useFetchApi } from '../../useFetchApi.js';
import { useUser } from "../../auth/context/UserContext.jsx";
import { useAlbunsCache } from "../cache/albumsCash.jsx";
import ExtraButtons from '../../shared/components/ExstraButtons.jsx';
import AddItemForm from '../../shared/components/AddItemForm.jsx';
import AlbumItem from '../components/AlbumItem.jsx';
import '../../../styles/albums.css';

function Albums() {
    const { userId } = useParams();
    const [albums, setAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getData, postData } = useFetchApi();
    const { currentUser } = useUser();
    const { getAlbums, setAlbumsCash } = useAlbunsCache();

    useEffect(() => {
        if (currentUser?.id) {
            showAlbums();
        }
    }, [currentUser]);


    
    //functions 
    async function showAlbums() {
        const cachedAlbums = getAlbums(currentUser.id);
        if (cachedAlbums) {
            setAlbums(cachedAlbums);
            setFilteredAlbums(cachedAlbums);
            setLoading(false);
            return;
        }
        goFetchAlbums();
    }
    async function goFetchAlbums() {
        setLoading(true);
        try {
            const data = await getData(`albums?userId=${currentUser.id}`);
            if (data && data.length > 0) {
                setAlbums(data);
                setFilteredAlbums(data);
                setAlbumsCash(currentUser.id, data);
            } else {
                setAlbums([]);
                setFilteredAlbums([]);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleAddAlbum = async (title) => {
        const newAlbum = {
            userId: currentUser.id,
            title: title
        };
        const createdAlbum = await postData('albums', newAlbum);
        if (createdAlbum) {
            const updatedAlbums = [...albums, createdAlbum];
            setAlbums(updatedAlbums);
            setAlbumsCash(currentUser.id, updatedAlbums);
        }
    };

    const handleFilteredAlbums = useCallback((filtered) => {
        setFilteredAlbums(filtered);
    }, []);

    if (loading) return <div>Loading albums...</div>;

    return (
        <div className="albums-container">
            <h1 className="albums-title">Albums Page</h1>

            <AddItemForm
                itemType="Album"
                onAdd={handleAddAlbum}
                placeholder="Album title..."
            />

            <ExtraButtons
                items={albums}
                buttonsToShow={['search', 'sort']}
                onFilteredItems={handleFilteredAlbums}
            />

            <div className="albums-list">
                {filteredAlbums.length > 0 ? (
                    filteredAlbums.map(album => (
                        <AlbumItem
                            key={album.id}
                            album={album}
                        />
                    ))
                ) : (
                    <div className="no-albums-message">
                        <p>No albums found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Albums;