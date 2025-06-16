const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const JWT_SECRET = 'your_super_secret_key_change_this'; // Use a more secure key in production
// --- MySQL Database Connection ---
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pramool_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

//  check for admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};





// --- API Endpoints ---

// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }
    try {
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            console.log(`Login attempt failed: User '${username}' not found.`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        // --- DEBUGGING LOGS ---
        console.log(`Login attempt for user: '${username}'`);
        console.log(`Password received: '${password}'`);
        console.log(`Password hash from DB: '${user.password_hash}'`);
        console.log('Password match result:', isMatch);
        // --- END DEBUGGING LOGS ---

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// Get all FAQs
app.get('/api/faq', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faqs ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all Webboard Posts - UPDATED to include profile_image_url
app.get('/api/webboard', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, p.user_id, p.message, p.created_at, 
                u.username as user, u.profile_image_url 
            FROM webboard_posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Create a Webboard Post - UPDATED to remove image_url
app.post('/api/webboard', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { id: userId, username } = req.user;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    try {
        // The image_url is no longer part of this table
        const [result] = await pool.query(
            'INSERT INTO webboard_posts (user_id, username, message) VALUES (?, ?, ?)',
            [userId, username, message]
        );
        const [newPostRows] = await pool.query(`
            SELECT p.id, p.user_id, p.message, p.created_at, u.username as user, u.profile_image_url 
            FROM webboard_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, 
            [result.insertId]
        );
        res.status(201).json(newPostRows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update a Webboard Post - UPDATED to remove image_url
app.put('/api/webboard/:id', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { id: postId } = req.params;
    const { id: userId, role } = req.user;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    try {
        const [posts] = await pool.query('SELECT user_id FROM webboard_posts WHERE id = ?', [postId]);
        if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
        if (posts[0].user_id !== userId && role !== 'admin') return res.status(403).json({ error: 'You are not authorized to edit this post' });
        
        await pool.query('UPDATE webboard_posts SET message = ? WHERE id = ?', [message, postId]);
        
        const [updatedPostRows] = await pool.query(`
            SELECT p.id, p.user_id, p.message, p.created_at, u.username as user, u.profile_image_url 
            FROM webboard_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, 
            [postId]
        );
        res.json(updatedPostRows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all Discussion Posts
app.get('/api/discussions', async (req, res) => {
    try {
        const query = `
            SELECT d.id, d.title, d.category, d.replies, d.has_pic, d.is_hot,
                   d.last_post_timestamp, u.username as author
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.last_post_timestamp DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Create a new Discussion Post - UPDATED to include content
app.post('/api/discussions', authenticateToken, async (req, res) => {
    const { title, category, has_pic, content } = req.body;
    const { id: userId } = req.user;

    if (!title || !category || !content) {
        return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO discussions (user_id, title, category, has_pic, content) VALUES (?, ?, ?, ?, ?)',
            [userId, title, category, has_pic ? 1 : 0, content]
        );
        res.status(201).json({ message: 'Discussion created successfully', discussionId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// Update a Discussion Post (Admin only)
app.put('/api/discussions/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { title, category } = req.body;
    const { id } = req.params;

    if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required' });
    }

    try {
        await pool.query(
            'UPDATE discussions SET title = ?, category = ? WHERE id = ?',
            [title, category, id]
        );
        const [updatedPost] = await pool.query('SELECT d.id, d.title, d.category, d.replies, d.has_pic, d.is_hot, d.last_post_timestamp, u.username as author FROM discussions d JOIN users u ON d.user_id = u.id WHERE d.id = ?', [id]);
        res.status(200).json(updatedPost[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a Discussion Post (Admin only)
app.delete('/api/discussions/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // The ON DELETE CASCADE in the DB schema will handle deleting associated replies.
        await pool.query('DELETE FROM discussions WHERE id = ?', [id]);
        res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get a single discussion post by ID
app.get('/api/discussions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT d.id, d.title, d.content, d.category, u.username as author, d.created_at
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            WHERE d.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all replies for a discussion post
app.get('/api/discussions/:id/replies', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT r.id, r.content, r.created_at, u.username as author, u.role
            FROM discussion_replies r
            JOIN users u ON r.user_id = u.id
            WHERE r.discussion_id = ?
            ORDER BY r.created_at ASC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Post a new reply to a discussion (Protected)
app.post('/api/discussions/:id/replies', authenticateToken, async (req, res) => {
    const { id: discussionId } = req.params;
    const { id: userId } = req.user;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Reply content cannot be empty' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert the new reply
        const [replyResult] = await connection.query(
            'INSERT INTO discussion_replies (discussion_id, user_id, content) VALUES (?, ?, ?)',
            [discussionId, userId, content]
        );
        const newReplyId = replyResult.insertId;

        // Update the reply count and last post timestamp on the parent discussion
        await connection.query(
            'UPDATE discussions SET replies = replies + 1, last_post_timestamp = NOW() WHERE id = ?',
            [discussionId]
        );

        // Fetch the newly created reply to return to the client
        const [newReplyRows] = await connection.query(`
            SELECT r.id, r.content, r.created_at, u.username as author, u.role
            FROM discussion_replies r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
        `, [newReplyId]);

        await connection.commit();
        res.status(201).json(newReplyRows[0]);
    } catch (err) {
        await connection.rollback();
        console.error(err.message);
        res.status(500).send("Server Error");
    } finally {
        connection.release();
    }
});

// Get all users (Admin only)
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all auctions
app.get('/api/auctions', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id, a.title, a.description, a.starting_price, 
                a.current_price, a.end_time, a.image_url, u.username as seller
            FROM auctions a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.end_time ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
