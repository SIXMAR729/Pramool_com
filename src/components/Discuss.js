import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Discuss.css';

const Discuss = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDiscussions = async () => {
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

        fetchDiscussions();
    }, []);

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
                    <button disabled>แก้ไข</button>
                    <button disabled>ลบ</button>
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
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                        <tr key={post.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                            <td className="status-col">
                                {post.is_hot ? <span className="status-hot">hot</span> : <span className="status-old">old</span>}
                            </td>
                            <td className="topic-col">
                                {post.has_pic ? <span className="pic-icon">(PIC)</span> : ''}
                                <a href="#">{post.title}</a>
                                <span className="category">({post.category})</span>
                            </td>
                            <td className="author-col">{post.author}</td>
                            <td className="replies-col">{post.replies}</td>
                            <td className="lastpost-col">
                                {new Date(post.last_post_timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                {' '}
                                {new Date(post.last_post_timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Discuss;
