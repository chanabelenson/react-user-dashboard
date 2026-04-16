
import React from 'react'
import { Link } from 'react-router-dom';
import { useUser } from "../../auth/context/UserContext.jsx";
import '../../../styles/home.css'

function Home() {
    const { currentUser } = useUser();
    return (
        <div className="home-content">
            <h1 className="home-title">Welcome</h1>
            
            <div className="welcome-message">
                <p className="welcome-text">
                    Hello {currentUser?.name || 'Guest'}, welcome to our task management system!
                </p>
            </div>
            
            <p className="home-subtitle">
                Here you can manage your tasks, posts and albums in a convenient and efficient way
            </p>
            
            <div className="home-features">
                <Link to={`/users/${currentUser.id}/todos`} className="feature-card">
                    <span className="feature-icon">✅</span>
                    <h3 className="feature-title">Task Management</h3>
                    <p className="feature-description">
                        Create, edit and delete tasks easily. Track your progress
                    </p>
                </Link>
                
                <Link to={`/users/${currentUser.id}/posts`} className="feature-card">
                    <span className="feature-icon">📝</span>
                    <h3 className="feature-title">Posts</h3>
                    <p className="feature-description">
                        Write and share posts, add comments and connect with others
                    </p>
                </Link>
                
                <Link to={`/users/${currentUser.id}/albums`} className="feature-card">
                    <span className="feature-icon">📸</span>
                    <h3 className="feature-title">Photo Albums</h3>
                    <p className="feature-description">
                        Organize and manage your photos in organized albums
                    </p>
                </Link>
            </div>
        </div>
    );
}

export default Home;