import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

export default function authenticate(req, res, next) {
    dotenv.config();
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.error('Token verification failed:', error.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
        const db = new sqlite3.Database('data/database.db');
        db.get(`SELECT * FROM users WHERE id = ?`, [decoded.id], (error, user) => {
            if (error) {
                console.error('Error fetching user:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            req.user = user;
            next();
        })
    })
}