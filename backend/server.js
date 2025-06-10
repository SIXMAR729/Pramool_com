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
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username } });
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

// Get all webboard posts
app.get('/api/webboard', async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.user_id, p.message, p.created_at, u.username as user
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

// Create a new webboard post (Protected)
app.post('/api/webboard', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { id: userId, username } = req.user;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO webboard_posts (user_id, username, message) VALUES (?, ?, ?)',
            [userId, username, message]
        );
        const newPostId = result.insertId;
        const [newPostRows] = await pool.query('SELECT p.id, p.user_id, p.message, p.created_at, u.username as user FROM webboard_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [newPostId]);
        res.status(201).json(newPostRows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update a webboard post (Protected)
app.put('/api/webboard/:id', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { id: postId } = req.params;
    const { id: userId } = req.user;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // First, verify the user owns the post
        const [posts] = await pool.query('SELECT user_id FROM webboard_posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (posts[0].user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' });
        }

        // Update the post
        await pool.query('UPDATE webboard_posts SET message = ? WHERE id = ?', [message, postId]);

        // Fetch and return the updated post
        const [updatedPostRows] = await pool.query('SELECT p.id, p.user_id, p.message, p.created_at, u.username as user FROM webboard_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [postId]);
        res.json(updatedPostRows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
