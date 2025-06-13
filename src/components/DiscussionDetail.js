import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


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
                // Fetch the main discussion post
                const postRes = await fetch(`http://localhost:3001/api/discussions/${id}`);
                if (!postRes.ok) throw new Error('Post not found');
                const postData = await postRes.json();
                setPost(postData);

                // Fetch the replies for the post
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
        if (!newReply.trim()) return;

        try {
            const response = await fetch(`http://localhost:3001/api/discussions/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                    <div className="text-sm text-gray-600 mb-4">
                        Posted by <span className="font-semibold">{post.author}</span> on {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="prose max-w-none text-gray-800">
                        {post.content}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Replies</h2>
                <div className="space-y-4">
                    {replies.map(reply => (
                        <div key={reply.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-gray-800">{reply.author}</p>
                                <p className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</p>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                        </div>
                    ))}
                </div>

                {user ? (
                    <div className="mt-6">
                        <form onSubmit={handleReplySubmit} className="bg-white rounded-lg shadow p-4">
                            <textarea
                                value={newReply}
                                onChange={e => setNewReply(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="4"
                                placeholder="Write a reply..."
                            ></textarea>
                            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Post Reply
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mt-6 text-center">
                        <p><Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to post a reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionDetail;

