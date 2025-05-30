import React, { useState } from 'react'; 
import './Webboard.css';

const initialPosts = [
  {
    id: 1,
    user: 'mannyman',
    date: '26-05-2006, 01:59:22',
    message: 'คุๆท่านเอ้ย ชิกก แรงโฟด',
  },
  {
    id: 2,
    user: '?',
    date: '26-05-2006, 02:12:26',
    message: 'ตกลงนี่ก็ยัง นั่งตามนี้',
  },
  {
    id: 3,
    user: 'M@rgo',
    date: '26-05-2006, 07:45:58',
    message: 'เอาใจคนไทยกันแบบนี้กัน',
  },
];

const Webboard = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !message) return;
    
    // Improved ID generation
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    const newPost = {
      id: newId,
      user: username,
      date: new Date().toLocaleString('th-TH'),
      message: message,
    };
    setPosts(prev => [...prev, newPost]);
    
    setUsername('');
    setMessage('');
    // Scroll to new post
    setTimeout(() => {
      const newPostElement = document.getElementById(`post-${newPost.id}`);
      if (newPostElement) {
        newPostElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };



  return (
    <div className="webboard-container">
      <h2 className="board-title">Palm Board (หน้าแรก)</h2>
      <div className="posts-container">
        {posts.map((post, index) => (
          <div
            key={post.id}
            id={`post-${post.id}`}
            // Removed 'animate-bounce' class and inline transform style
            className={`post-item ${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}
            // Removed: style={{ transform: animateIndex === index ? 'translateY(-5px)' : 'translateY(0)' }}
          >
            <div className="post-header flex items-center justify-between">
              {/* Wrapped user info and circle picture in a flex container */}
              <div className="flex items-center">
                {/* Mockup Little Circle Picture */}
                <div className="w-8 h-8 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-blue-600">{post.user}</span>
                  <span className="text-gray-500 text-sm ml-2">[ {post.date} ]</span>
                </div>
              </div>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
                [Edit message]
              </a>
            </div>
            <div className="post-content mt-2">{post.message}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="post-form mt-4 p-4 border rounded">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">ชื่อผู้โพสต์:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={50}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ข้อความ:</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="พิมโพสตรงนี้..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          โพสต์ข้อความ
        </button>
      </form>
    </div>
  );
};

export default Webboard;