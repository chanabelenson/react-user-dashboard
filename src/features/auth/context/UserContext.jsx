import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && savedUser !== 'undefined') {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (basicUser, fetchFunction) => {
        const fullUserInfo = await fetchFunction(`users/${basicUser.id}`);
        if (fullUserInfo) {
            const basicUserData = {
                id: fullUserInfo.id,
                username: fullUserInfo.username,
                name: fullUserInfo.name,
                email: fullUserInfo.email
            };
            localStorage.setItem("currentUser", JSON.stringify(basicUserData));
            setCurrentUser(fullUserInfo);
        } else {
            localStorage.setItem("currentUser", JSON.stringify(basicUser));
            setCurrentUser(basicUser);
        }
        return Promise.resolve();
    };

    const logout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setCurrentUser(null);
        setShowLogoutModal(false);
        navigate('/login');
        localStorage.clear(); 
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <UserContext.Provider value={{ currentUser, loading, login, logout }}>
            {children}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>🚪 Logout Confirmation</h3>
                        <p>Are you sure you want to logout from the system?</p>
                        <p className="warning-text">All saved data will be deleted</p>
                        <div className="modal-buttons">
                            <button className="btn-confirm" onClick={confirmLogout}>
                                ✓ Yes, Logout
                            </button>
                            <button className="btn-cancel" onClick={cancelLogout}>
                                ✗ Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
