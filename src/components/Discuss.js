import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Discuss.css';


const Discuss = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, token } = useAuth();

    // State for inline editing
    const [editingPost, setEditingPost] = useState(null);

    const fetchDiscussions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/discussions`);
            if (!response.ok) {
                throw new Error('Failed to fetch discussion posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const handleEditClick = (post) => {
        // Create a copy of the post to avoid mutating state directly
        setEditingPost({ ...post });
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    const handleUpdatePost = async () => {
        if (!editingPost) return;

        try {
            const response = await fetch(`http://localhost:3001/api/discussions/${editingPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: editingPost.title,
                    category: editingPost.category
                })
            });
            if (!response.ok) throw new Error('Failed to update post');
            
            // Refresh the list to show the updated data from the server
            fetchDiscussions();
            setEditingPost(null);

        } catch (err) {
            console.error(err.message);
            setError(err.message);
        }
    };
    
    const handleDeletePost = async (postId) => {
        // Use a standard browser confirm dialog
        if (window.confirm('Are you sure you want to delete this topic and all its replies?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/discussions/${postId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete post');
                
                // Remove the post from the local state to update the UI instantly
                setPosts(posts.filter(p => p.id !== postId));

            } catch (err) {
                console.error(err.message);
                setError(err.message);
            }
        }
    };


    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="discuss-container">
            <div className="discuss-header">
                <span>เรียงตาม: ID</span>
                <div className="discuss-actions">
                    {user && (
                        <Link to="/discuss/new">
                            <button>เขียน</button>
                        </Link>
                    )}
                </div>
            </div>
            <table className="discuss-table">
                <thead>
                    <tr>
                        <th className="status-col">สถานะ</th>
                        <th className="topic-col">หัวข้อ</th>
                        <th className="author-col">โดย</th>
                        <th className="replies-col">ตอบ</th>
                        <th className="lastpost-col">โพสล่าสุด</th>
                        {user && user.role === 'admin' && <th className="actions-col">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                         editingPost && editingPost.id === post.id ? (
                            // Editing Row
                            <tr key={post.id} className="row-editing">
                                <td></td>
                                <td colSpan="4">
                                    <div className="flex flex-col space-y-2 p-2">
                                        <input 
                                            type="text" 
                                            value={editingPost.title}
                                            onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                            className="p-1 border rounded w-full"
                                        />
                                        <input 
                                            type="text" 
                                            value={editingPost.category}
                                            onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                            className="p-1 border rounded w-full"
                                        />
                                    </div>
                                </td>
                                <td className="actions-col">
                                    <button onClick={handleUpdatePost} className="action-btn save">Save</button>
                                    <button onClick={handleCancelEdit} className="action-btn cancel">Cancel</button>
                                </td>
                            </tr>
                         ) : (
                            // Default Row
                            <tr key={post.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                <td className="status-col">
                                    {post.is_hot ? <span className="status-hot">hot</span> : <span className="status-old">old</span>}
                                </td>
                                <td className="topic-col">
                                    {post.has_pic ? <span className="pic-icon">(PIC)</span> : ''}
                                    <Link to={`/discuss/${post.id}`} className="topic-link">{post.title}</Link>
                                    <span className="category">({post.category})</span>
                                </td>
                                <td className="author-col">{post.author}</td>
                                <td className="replies-col">{post.replies}</td>
                                <td className="lastpost-col">
                                    {new Date(post.last_post_timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                    {' '}
                                    {new Date(post.last_post_timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                {user && user.role === 'admin' && (
                                    <td className="actions-col">
                                        <button onClick={() => handleEditClick(post)} className="action-btn edit">Edit</button>
                                        <button onClick={() => handleDeletePost(post.id)} className="action-btn delete">Delete</button>
                                    </td>
                                )}
                            </tr>
                         )
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Discuss;
