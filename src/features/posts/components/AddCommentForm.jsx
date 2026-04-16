import React, { useState } from 'react';
import { useFetchApi } from '../../useFetchApi.js';
import { useUser } from '../../auth/context/UserContext.jsx';

function AddCommentForm({ postId, onCommentAdded, onClose }) {
  const { postData } = useFetchApi();
  const { currentUser } = useUser();
  const [newComment, setNewComment] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newComment.title.trim() || !newComment.body.trim()) {
      setError('Please fill all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      const commentData = {
        postId: parseInt(postId),
        name: newComment.title.trim(),
        email: currentUser?.email,
        body: newComment.body.trim(),
        userId: currentUser?.id
      };
      
      const result = await postData('comments', commentData);
      if (result) {
        onCommentAdded(result);
        setNewComment({ title: '', body: '' });
        setError('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{position: 'relative'}}>
      <button 
        type="button" 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '25px',
          height: '25px',
          fontSize: '16px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        ×
      </button>
      <form onSubmit={handleAddComment} className="add-comment-form">
        <h4>Add Comment</h4>
      
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={currentUser?.email || ''} 
            disabled 
            className="form-input disabled"
          />
        </div>
        
        <div className="form-group">
          <label>Comment Title:</label>
          <input 
            type="text" 
            value={newComment.title || ''}
            onChange={(e) => setNewComment({...newComment, title: e.target.value})}
            placeholder="Comment title..."
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Comment Content:</label>
          <textarea 
            value={newComment.body || ''}
            onChange={(e) => setNewComment({...newComment, body: e.target.value})}
            placeholder="Write your comment here..."
            className="form-textarea"
            rows="3"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Adding Comment...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
}

export default AddCommentForm;