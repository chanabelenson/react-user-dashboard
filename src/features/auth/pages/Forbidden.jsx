import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext';
import '../../../styles/forbidden.css';

function Forbidden() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    const goToMyProfile = () => {
        if (currentUser) {
            navigate(`/users/${currentUser.id}/home`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="forbidden-container">
            <div className="forbidden-card">
                <h1 className="forbidden-title">403</h1>
                <h2 className="forbidden-subtitle">Access Denied</h2>
                <p className="forbidden-text">You do not have permission to view this profile.</p>
                <p className="forbidden-bold-text">You can only access your own profile.</p>
                
                <button onClick={goToMyProfile} className="forbidden-button">
                    {currentUser ? 'Go to My Profile' : 'Go to Login'}
                </button>
            </div>
        </div>
    );
}

export default Forbidden;