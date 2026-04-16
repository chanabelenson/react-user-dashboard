import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../auth/context/UserContext.jsx";
import { useFetchApi } from "../../useFetchApi.js";
import PostItem from '../components/PostItem.jsx';
import AddPostForm from '../components/AddPostForm.jsx';
import Search from '../components/Search.jsx';
import '../../../styles/posts.css';
import '../../../styles/post-card.css';

function Posts() {
  const { userId,postId} = useParams();
  const { currentUser } = useUser();
  const { getData, postData, putData, deleteData } = useFetchApi();
  const [posts, setPosts] = useState([]);
  const [cachedPosts, setCachedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const searchOptions = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
    { value: 'name', label: 'Name' }
  ];

  const loadPosts = async () => {
    const data = await getData(`posts?_start=${page * 9}&_limit=9`);
    if (data?.length) {
      const newPosts = page === 0 ? data : [...cachedPosts, ...data];
      setCachedPosts(newPosts);
      setPosts(newPosts);
      setFilteredPosts(newPosts);
      if (data.length < 9) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };



  /// API by props... to extra buttons
  const handleAddPost = async (postFormData) => {
    setIsAdding(true);
    const newPost = {
      userId: currentUser?.id,
      title: postFormData.title,
      body: postFormData.body
    };

    const createdPost = await postData('posts', newPost);
    if (createdPost) {
      const updatedPosts = [createdPost, ...posts];
      setPosts(updatedPosts);
      setCachedPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setShowAddForm(false);
    }
    setIsAdding(false);
  };

  const handleUpdatePost = async (updatedPost) => {
    const result = await putData(`posts/${updatedPost.id}`, updatedPost);
    if (result) {
      const updatedPosts = posts.map(p => p.id === updatedPost.id ? result : p);
      setPosts(updatedPosts);
      setCachedPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    }
  };

  const handleDeletePost = async (id) => {
    const success = await deleteData(`posts/${id}`);
    if (success) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      setCachedPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadPosts();
    }
  }, [currentUser?.id, page]);

  return (
    <div className="posts-container posts-page">
      <h1 className="posts-title">All Posts</h1>

      <div className="add-post-section">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-post-btn"
        >
          {showAddForm ? 'Cancel' : 'Add New Post'}
        </button>
      </div>

      {showAddForm && <AddPostForm onAdd={handleAddPost} isAdding={isAdding} />}

      <Search
        items={posts}
        onFilteredItems={(filtered) => setFilteredPosts(filtered)}
      />

      <div className="posts-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              currentUserId={currentUser?.id}
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <p className="no-posts">No posts found</p>
        )}
      </div>

      {hasMore && (
        <button onClick={() => setPage(p => p + 1)} className="load-more-btn">Load More</button>
      )}
    </div>
  );
}

export default Posts;

