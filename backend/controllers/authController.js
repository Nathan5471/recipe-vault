import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = new sqlite3.Database('data/database.db');
        db.run(`INSERT INTO users (username, password, account_type) VALUES (?, ?, ?)`, [username, hashedPassword, 'user'], function(error) {
            if (error) {
                console.error('Error inserting user:', error.message);
                return res.status(409).json({ error: 'User already exists' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastId });
        })
        db.close();
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = new sqlite3.Database('data/database.db');
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (error, user) => {
            if (error) {
                console.error('Error fetching user:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = generateToken(user.id);
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(200).json({ message: 'Login successful', userId: user.id})
        })
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}