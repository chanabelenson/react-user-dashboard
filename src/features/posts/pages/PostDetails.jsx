import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext.jsx';
import { useFetchApi } from '../../useFetchApi.js';
import ItemActions from '../../shared/components/ItemActions.jsx';
import CommentsManager from '../components/CommentsManager.jsx';
import AddCommentForm from '../components/AddCommentForm.jsx';
import '../../../styles/post-details.css';
import '../../../styles/modals.css';


function PostDetails() {
  const { postId, userId } = useParams();
  const { currentUser } = useUser();
  const { getData, putData, deleteData } = useFetchApi();
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = post && String(post.userId) === String(currentUser.id);

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  const loadPostDetails = async () => {
    setLoading(true);
    try {
      // טעינת הפוסט
      const postData = await getData(`posts/${postId}`);
      setPost(postData);

      // טעינת פרטי המחבר
      if (postData?.userId) {
        const authorData = await getData(`users/${postData.userId}`);
        setAuthor(authorData);
      }
    } catch (error) {
      console.error('Error loading post details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowComments = () => {
    setShowComments(true);
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleUpdatePost = async (updatedPost) => {
    const result = await putData(`posts/${updatedPost.id}`, updatedPost);
    if (result) {
      setPost(result);
    }
  };

  const handleDeletePost = async (id) => {
    const success = await deleteData(`posts/${id}`);
    if (success) {
      // חזרה לרשימת הפוסטים אחרי מחיקה
      window.history.back();
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="app-layout">
      <div className="main-wrapper">
        <div className="page-header">
          <h1>POST DETAILS</h1>
        </div>
        <div className="posts-container">
        <Link to={`/users/${userId}/posts`} className="back-link">
          ← back to posts
        </Link>
        
        <article className="post-details">
          <header className="post-header">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span>Post #{post.id}</span>
              {author && <span>By {author.name} (@{author.username})</span>}
            </div>
            {isOwner && (
              <ItemActions
                item={post}
                itemType="posts"
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
                editFields={['title', 'body']}
              />
            )}
          </header>
          
          <div className="post-content">
            <p>{post.body}</p>
          </div>
          
          <div className="post-bottom">
            <div className="comments-actions">
              <button className="btn btn-primary" onClick={handleShowComments}>
                Show Comments
              </button>
              <button className="btn btn-secondary" onClick={handleShowAddForm}>
                Add Comment
              </button>
            </div>
          </div>
          
          {showAddForm && (
            <div className="add-comment-section">
              <AddCommentForm postId={postId} onCommentAdded={() => setShowAddForm(false)} onClose={() => setShowAddForm(false)} />
            </div>
          )}
          
          {showComments && (
            <CommentsManager postId={postId} />
          )}
      </article>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;