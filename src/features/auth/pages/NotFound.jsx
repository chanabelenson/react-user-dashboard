import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext';
import '../../../styles/not-found.css';

function NotFound() {
    const navigate = useNavigate();
    const { currentUser } = useUser();

    const handleGoBack = () => {
        navigate(-1); 
    };

    const handleGoHome = () => {
        if (currentUser) {
            navigate(`/users/${currentUser.id}/home`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="not-found-container">
            <div className="not-found-card">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-text">Oops! The page you are looking for does not exist.</p>
                <p className="not-found-text">It might have been moved or deleted.</p>
                
                <div className="not-found-button-group">
                    <button onClick={handleGoBack} className="not-found-back-button">
                        ← Go Back
                    </button>
                    <button onClick={handleGoHome} className="not-found-home-button">
                        {currentUser ? 'Go to Home' : 'Go to Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;