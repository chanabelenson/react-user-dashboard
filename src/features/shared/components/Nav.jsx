import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext.jsx';
import Info from './Info.jsx';
import '../../../styles/global-nav.css';

function Nav() {
    const { logout, currentUser } = useUser();
    const location = useLocation();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const userId = currentUser?.id;

    if (!currentUser) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    const handleInfo = () => {
        setIsInfoOpen(true);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            <nav className="sidebar">
                <ul>
                    <li><Link to={`/users/${userId}/home`} className={isActive(`/users/${userId}/home`) ? 'active' : ''}>Home</Link></li>
                    <li><Link to={`/users/${userId}/todos`} className={isActive(`/users/${userId}/todos`) ? 'active' : ''}>Todos</Link></li>
                    <li><Link to={`/users/${userId}/posts`} className={isActive(`/users/${userId}/posts`) ? 'active' : ''}>Posts</Link></li>
                    <li><Link to={`/users/${userId}/albums`} className={isActive(`/users/${userId}/albums`) ? 'active' : ''}>Albums</Link></li>
                    <li>
                        <button className="sidebar-btn" onClick={handleInfo}>
                            Info
                        </button>
                    </li>
                </ul>
                <div className="logout-container">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {isInfoOpen && (
                <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsInfoOpen(false)}>
                            &times;
                        </button>
                        <Info />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Nav;
