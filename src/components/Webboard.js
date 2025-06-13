import React, { useState, useEffect, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Webboard.css';

const Webboard = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const { user, token } = useAuth();
  
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const postsContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/webboard?t=${new Date().getTime()}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        // It's okay if this fails when logged out, so we don't need to log an error.
      }
    };
    
    if (user) {
        fetchPosts();
        const intervalId = setInterval(fetchPosts, 10000);
        return () => clearInterval(intervalId);
    } else {
        // If the user logs out, clear the posts from the screen.
        setPosts([]);
    }

  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !user) return;

    try {
      const response = await fetch('http://localhost:3001/api/webboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
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
  
  // If the user is not logged in, show a message and hide the webboard.
  if (!user) {
      return (
        <div className="webboard-container">
            <h2 className="board-title">Palm Board (หน้าแรก)</h2>
            <div className="mt-4 p-4 border rounded text-center">
                <p>Please <Link to="/login" className="text-orange-600 hover:underline">login</Link> to see the webboard.</p>
            </div>
        </div>
      )
  }

  // If the user is logged in, show the full webboard.
  return (
  <div className="webboard-container">
      <h2 className="board-title">Palm Board (หน้าแรก)</h2>
      <div className="posts-container" ref={postsContainerRef}>
        {posts.map((post, index) => (
          <div key={post.id} id={`post-${post.id}`} className={`post-item ${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="post-header flex items-center justify-between">
              <div className="flex items-center">
                <img 
                    src={post.profile_image_url || 'https://placehold.co/40x40/cccccc/ffffff?text=User'} 
                    alt={post.user}
                    className="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover"
                />
                <div>
                  <span className="font-bold text-orange-600">{post.user}</span>
                  <span className="text-gray-500 text-sm ml-2">[ {new Date(post.created_at).toLocaleString('th-TH')} ]</span>
                </div>
              </div>
              {(user.id === post.user_id || user.role === 'admin') && editingPostId !== post.id && (
                <button onClick={() => handleEditClick(post)} className="text-gray-500 hover:text-orange-600 text-sm">
                  [Edit message]
                </button>
              )}
            </div>
            <div className="post-content mt-2">
              {editingPostId === post.id ? (
                // Editing form no longer includes an image URL field
                <div className="edit-form space-y-2">
                  <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full p-2 border rounded" rows="3" />
                  <div className="mt-2">
                    <button onClick={() => handleUpdatePost(post.id)} className="bg-orange-500 text-white px-3 py-1 rounded text-sm mr-2">Save</button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <p>{post.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
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
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">โพสต์ข้อความ</button>
      </form>
    </div>
  );
};

export default Webboard;
