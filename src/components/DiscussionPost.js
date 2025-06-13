import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DiscussionPost.css';


const DiscussionPost = () => {
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchPostAndReplies = async () => {
            try {
                const [postRes, repliesRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/discussions/${id}`),
                    fetch(`http://localhost:3001/api/discussions/${id}/replies`)
                ]);

                if (!postRes.ok) throw new Error('Post not found');
                
                const postData = await postRes.json();
                const repliesData = await repliesRes.ok ? await repliesRes.json() : [];

                setPost(postData);
                setReplies(repliesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndReplies();
    }, [id]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!newReply.trim() || !user) return;

        try {
            const response = await fetch(`http://localhost:3001/api/discussions/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newReply })
            });

            if (!response.ok) throw new Error('Failed to submit reply');

            const savedReply = await response.json();
            setReplies([...replies, savedReply]);
            setNewReply('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="post-page-container">
            <h2 className="post-page-title">
                {post.category ? `[ ${post.category} ]` : ''} {post.title}
            </h2>
            
            {/* Original Post */}
            <div className="reply-container">
                <div className="user-info">
                    <p className="username">{post.author}</p>
                    {/* Add more user details here if needed */}
                </div>
                <div className="reply-content">
                    <div className="reply-header">
                        <span>{new Date(post.created_at).toLocaleString('en-GB')}</span>
                        <a href="#">[ Edit message ]</a>
                    </div>
                    <div className="reply-body" dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>
                </div>
            </div>

            {/* Replies */}
            {replies.map((reply, index) => (
                <div key={reply.id} className="reply-container">
                    <div className="user-info">
                        <p className="username">{reply.author}</p>
                        <p className="user-role">{reply.role}</p>
                    </div>
                    <div className="reply-content">
                        <div className="reply-header">
                            <span>{new Date(reply.created_at).toLocaleString('en-GB')}</span>
                            <a href="#">[ Edit message ]</a>
                        </div>
                        <div className="reply-body">
                            {reply.content}
                        </div>
                    </div>
                </div>
            ))}

            {/* Reply Form */}
            {user ? (
                <div className="reply-form-container">
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Write your reply..."
                            rows="5"
                        ></textarea>
                        <button type="submit">Post Reply</button>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    Please <Link to="/login">login</Link> to reply.
                </div>
            )}
        </div>
    );
};

export default DiscussionPost;
