import { Link } from "react-router-dom";
import { useUser } from "../../auth/context/UserContext.jsx";

function AlbumItem({ album }) {
    const { currentUser } = useUser();
    
    return (
        <Link
            to={`/users/${currentUser.id}/albums/${album.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div className="album-item">
                <div className="album-header">
                    <span className="album-id">#{album.id}</span>
                    <span className="album-icon">📁</span>
                </div>
                <h3 className="album-title">{album.title}</h3>
                <div className="album-footer">
                    <span className="album-photos-count">View Photos</span>
                    <span className="album-arrow">→</span>
                </div>
            </div>
        </Link>
    );
}

export default AlbumItem;