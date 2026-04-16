import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext.jsx';
import ItemActions from '../../shared/components/ItemActions.jsx';

function PostItem({ post, currentUserId, onUpdate, onDelete }) {
  const { currentUser } = useUser();
  const isOwner = String(post.userId) === String(currentUserId);

  return (
    <div className="post-card">
      <span className="post-id">#{post.id}</span>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
      <div className="post-author">By User #{post.userId}</div>
      
      <div className="post-actions">
        <Link 
          to={`/users/${currentUser.id}/posts/${post.id}`}
          className="select-btn"
          style={{ textDecoration: 'none' }}
        >
          Read More
        </Link>
        
        {isOwner && (
          <ItemActions
            item={post}
            itemType="posts"
            onUpdate={onUpdate}
            onDelete={onDelete}
            editFields={['title', 'body']}
          />
        )}
      </div>
    </div>
  );
}

export default PostItem;