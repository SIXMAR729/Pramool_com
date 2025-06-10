import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Webboard.css';

const Webboard = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const { user, token } = useAuth(); // Get user from context
  
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch posts from the database when the component mounts
  useEffect(() => {
    // Since this component is protected, we can assume a user exists.
    // However, fetching data should be independent of login status for viewing.
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/webboard');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !user) return;

    try {
      const response = await fetch('http://localhost:3001/api/webboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the token
        },
        // The body no longer needs the username
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      
      setPosts(prevPosts => [...prevPosts, newPost]);
      setMessage('');

    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditingText(post.message);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingText('');
  };

  const handleUpdatePost = async (postId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/webboard/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ message: editingText }),
        });

        if (!response.ok) throw new Error('Failed to update post');

        const updatedPost = await response.json();
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        handleCancelEdit();
    } catch (error) {
        console.error('Error updating post:', error);
    }
  };

  return (
    <div className="webboard-container">
      <h2 className="board-title">Palm Board (หน้าแรก)</h2>
      <div className="posts-container">
        {posts.map((post, index) => (
          <div
            key={post.id}
            id={`post-${post.id}`}
            className={`post-item ${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}
          >
            <div className="post-header flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-blue-600">{post.user}</span>
                  <span className="text-gray-500 text-sm ml-2">[ {new Date(post.created_at).toLocaleString('th-TH')} ]</span>
                </div>
              </div>
              {user && (user.id === post.user_id || user.role === 'admin') && editingPostId !== post.id && (
                <button onClick={() => handleEditClick(post)} className="text-gray-500 hover:text-blue-600 text-sm">
                  [Edit message]
                </button>
              )}
            </div>
            <div className="post-content mt-2">
              {editingPostId === post.id ? (
                <div className="edit-form">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div className="mt-2">
                    <button onClick={() => handleUpdatePost(post.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2">Save</button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                post.message
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* The form is now simplified and only shows for logged-in users */}
      {user ? (
        <form onSubmit={handleSubmit} className="post-form mt-4 p-4 border rounded">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">ข้อความ (โพสต์ในชื่อ: {user.username}):</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="พิมโพสตรงนี้..."
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">โพสต์ข้อความ</button>
        </form>
      ) : (
        // This part is now handled by ProtectedRoute, but can be kept as a fallback.
        <div className="mt-4 p-4 border rounded text-center">
          <p>กรุณา <Link to="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link> เพื่อโพสต์ข้อความ</p>
        </div>
      )}
    </div>
  );
};

export default Webboard;
