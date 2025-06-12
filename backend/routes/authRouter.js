import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    registerUser(req, res);
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    loginUser(req, res);
})

router.post('/logout', (req, res) => {
    // Logout logic here
})

router.get('/', (req, res) => {
    // Get user info logic here
})

router.delete('/delete', (req, res) => {
    // Delete user logic here
})

router.put('/update', (req, res) => {
    // Update user info logic here
})

router.get('/all', (req, res) => {
    // Get all users logic here
})

export default router;