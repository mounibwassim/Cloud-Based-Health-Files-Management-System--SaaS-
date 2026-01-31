const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

        // Fetch user
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Verify password
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate Token
        // Role based access? For now, just store minimal info.
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register (Optional, for creating other admins)
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert
        // Need ID for postgres usually, but our helpers return rows or lastID
        // We use the helper.
        // If SQL, use RETURNING if PG, but helper handles basic SQLite.
        // We need separate logic or unified query from server.js learnings.
        // Let's use the explicit 'RETURNING id' if it's PG, but we don't know easily inside router without db implementation detail.
        // However, we can just INSERT and then SELECT if needed across both.
        // OR rely on our server.js finding: just standard INSERT works for SQLite, returns lastID in helper.

        const query = `INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)`;
        try {
            await db.query(query, [username, passwordHash, email]);
        } catch (e) {
            if (e.message.includes('UNIQUE constraint') || e.code === '23505') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            throw e;
        }

        res.json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password (Mock)
router.post('/forgot-password', async (req, res) => {
    const { username } = req.body;
    // Mock logic: Always say success to prevent enumeration, or if dev mode, return the temp implementation
    console.log(`[Mock Email] Password reset requested for: ${username}`);
    res.json({ message: 'If account exists, password reset instructions have been sent.' });
});

module.exports = router;
