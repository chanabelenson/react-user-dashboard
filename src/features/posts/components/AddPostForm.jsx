import React, { useState } from 'react';

function AddPostForm({ onAdd, isAdding }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && body.trim() && !isAdding) {
            onAdd({ title: title.trim(), body: body.trim() });
            setTitle('');
            setBody('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Add New Post</h3>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isAdding}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <textarea
                    placeholder="Post content..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={isAdding}
                    rows="4"
                    style={{ width: '100%', padding: '8px', resize: 'vertical' }}
                />
            </div>
            <button 
                type="submit" 
                disabled={isAdding || !title.trim() || !body.trim()}
                style={{ 
                    padding: '8px 16px', 
                    backgroundColor: isAdding ? '#6c757d' : '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '3px',
                    cursor: isAdding ? 'not-allowed' : 'pointer'
                }}
            >
                {isAdding ? 'Adding...' : 'Add Post'}
            </button>
        </form>
    );
}

export default AddPostForm;