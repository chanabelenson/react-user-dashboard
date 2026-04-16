import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext.jsx';
import Nav from '../../shared/components/Nav.jsx';

function ProtectedRoute() {
    const { userId } = useParams();
    const { currentUser, loading } = useUser();
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (userId && String(userId) !== String(currentUser.id)) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="app-layout">
            <Nav />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default ProtectedRoute;