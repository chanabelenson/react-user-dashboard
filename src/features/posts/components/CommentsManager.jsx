import React, { useState, useEffect } from 'react';
import { useFetchApi } from '../../useFetchApi.js';
import { useUser } from '../../auth/context/UserContext.jsx';
import ItemActions from '../../shared/components/ItemActions.jsx';
import '../../../styles/comments.css';

function CommentsManager({ postId }) {
  const { getData, putData, deleteData } = useFetchApi();
  const { currentUser } = useUser();
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(3);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const commentsData = await getData(`comments?postId=${postId}`);
      setAllComments(commentsData || []);
      setComments(commentsData.slice(0, 3) || []);
      setCurrentIndex(3);
    } catch (error) {
      setComments([]);
      setAllComments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = () => {
    setLoadingMore(true);
    const nextComments = allComments.slice(0, currentIndex + 3);
    setComments(nextComments);
    setCurrentIndex(currentIndex + 3);
    setLoadingMore(false);
  };

  const handleUpdateComment = async (updatedComment) => {
    const result = await putData(`comments/${updatedComment.id}`, updatedComment);
    if (result) {
      setComments(comments.map(c => c.id === result.id ? result : c));
      setAllComments(allComments.map(c => c.id === result.id ? result : c));
    }
  };

  const handleDeleteComment = async (id) => {
    const success = await deleteData(`comments/${id}`);
    if (success) {
      setComments(comments.filter(c => c.id !== id));
      setAllComments(allComments.filter(c => c.id !== id));
    }
  };

  const hasMoreComments = currentIndex < allComments.length;

  if (loading) return <div>Loading comments...</div>;

  return (
    <section className="comments-section">
      <h3>Comments ({comments.length})</h3>
            {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => {
          const isCommentOwner = String(comment.userId) === String(currentUser?.id);
          return (
            <div key={comment.id} className="comment">
              <strong>{comment.name}</strong>
              <p>{comment.body}</p>
              <small>{comment.email}</small>
              {isCommentOwner && (
                <ItemActions
                  item={comment}
                  itemType="comments"
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  editFields={['name', 'body']}
                />
              )}
            </div>
          );
        })
      )}
      
      {hasMoreComments && (
        <button 
          className="btn btn-secondary" 
          onClick={loadMoreComments}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load More Comments'}
        </button>
      )}
    </section>
  );
}

export default CommentsManager;