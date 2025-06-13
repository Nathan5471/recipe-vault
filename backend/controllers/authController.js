import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = new sqlite3.Database('data/database.db');
        let accountType = 'user';
        db.get(`SELECT COUNT(*) AS count FROM users`, (error, row) => {
            if (error) {
                console.error('Error checking user count:', error.message);
                db.close();
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (row.count === 0) {
                accountType = 'admin'; // First user is an admin
            }
            db.run(`INSERT INTO users (username, password, account_type) VALUES (?, ?, ?)`, [username, hashedPassword, accountType], (error) => {
                if (error) {
                    console.error('Error inserting user:', error.message);
                    db.close();
                    return res.status(409).json({ message: 'User already exists' });
                }
                res.status(201).json({ message: 'User registered successfully' });
                db.close();
            })
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = new sqlite3.Database('data/database.db');
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (error, user) => {
            if (error) {
                console.error('Error fetching user:', error.message);
                db.close();
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!user) {
                db.close();
                return res.status(404).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                db.close();
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = generateToken(user.id);
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(200).json({ message: 'Login successful', userId: user.id})
            db.close();
        })
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

export const deleteUser = (req, res) => {
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.run(`DELETE FROM users WHERE id = ?`, [userId], (error) => {
        if (error) {
            console.error('Error deleting user:', error.message);
            db.close();
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
        db.close();
    })
}

export const updateUsername = (req, res) => {
    const userId = req.user.id;
    const { newUsername } = req.body;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT * FROM users WHERE username = ?`, [newUsername], (error, user) => {
        if (error) {
            console.error('Error checking username:', error.message);
            db.close();
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (user) {
            db.close();
            return res.status(409).json({ message: 'Username already exists' });
        }
        db.run(`UPDATE users SET username = ? WHERE id = ?`, [newUsername, userId], (error) => {
            if (error) {
                console.error('Error updating username:', message.message);
                db.close();
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Username updated successfully' });
            db.close();
        })
    })
}

export const updatePassword = async (req, res) => {
    const userId = req.user.id;
    const { newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const db = new sqlite3.Database('data/database.db');
        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], (error) => {
            if (error) {
                console.error('Error updating password:', error.message);
                db.close();
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Password updated successfully' });
            db.close();
        })
        
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateAccountType = (req, res) => {
    const { userIdToUpdate, newAccountType } = req.body;
    if (req.user.account_type !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update account types' });
    }
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT * FROM users WHERE id = ?`, [userIdToUpdate], (error, user) => {
        if (error) {
            console.error('Error fetching user:', error.message);
            db.close();
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            db.close();
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.account_type === newAccountType) {
            db.close();
            return res.status(400).json({ error: 'User already has this account type' });
        }
        db.run(`UPDATE users SET account_type = ? WHERE id = ?`, [newAccountType, userIdToUpdate], (error) => {
            if (error) {
                console.error('Error updating account type:', error.message);
                db.close();
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'Account type updated successfully' });
            db.close();
        })
    })
}

export const getAllUsers = (req, res) => {
    const db = new sqlite3.Database('data/database.db');
    db.all(`SELECT id, username, account_type, created_at FROM users`, [], (error, users) => {
        if (error) {
            console.error('Error fetching users:', error.message);
            db.close();
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (users.length === 0) {
            db.close();
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
        db.close();
    })
}