import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DiscussionDetail.css';


const DiscussionDetail = () => {
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
                const postRes = await fetch(`http://localhost:3001/api/discussions/${id}`);
                if (!postRes.ok) throw new Error('Post not found');
                const postData = await postRes.json();
                setPost(postData);

                const repliesRes = await fetch(`http://localhost:3001/api/discussions/${id}/replies`);
                if (!repliesRes.ok) throw new Error('Could not fetch replies');
                const repliesData = await repliesRes.json();
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({ content: newReply })
            });
            if (!response.ok) {
                throw new Error('Failed to post reply.');
            }
            
            const addedReply = await response.json();
            setReplies([...replies, addedReply]);
            setNewReply('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    if (!post) return null;

    const Post = ({ postData, isOriginalPost = false }) => (
        <div className="post-container">
            <div className="author-info">
                <p className="author-name">{postData.author}</p>
                {postData.role === 'admin' && <span className="admin-star">⭐</span>}
                <img 
                    src={postData.profile_image_url || 'https://placehold.co/80x80/cccccc/ffffff?text=User'} 
                    alt={postData.author}
                    className="author-avatar"
                />
                 <div className="author-icons">
                    <span>✉️</span>
                    <span>👤</span>
                 </div>
            </div>
            <div className="post-content">
                <div className="post-meta">
                    <span className="post-date">{new Date(postData.created_at).toLocaleString('th-TH')}</span>
                    {isOriginalPost && <span className="post-topic-title">{post.title}</span>}
                    <a href="#" className="edit-link">[Edit message]</a>
                </div>
                <div className="post-body">
                    {/* Check if content exists before trying to split it */}
                    {postData.content && postData.content.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="discussion-detail-page">
            <div className="topic-header">
                <span>-- {post.title} --</span>
            </div>
            
            <Post postData={post} isOriginalPost={true} />
            
            {replies.map(reply => (
                <Post key={reply.id} postData={reply} />
            ))}

            {user && (
                <div className="reply-form-container">
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            value={newReply}
                            onChange={e => setNewReply(e.target.value)}
                            placeholder="Write your reply..."
                            rows="5"
                        ></textarea>
                        <button type="submit">Post Reply</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DiscussionDetail;
