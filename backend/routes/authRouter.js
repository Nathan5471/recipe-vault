import express from 'express';
import { registerUser, loginUser, logoutUser, deleteUser, updateUsername, updatePassword, updateAccountType, getAllUsers } from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    registerUser(req, res);
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    loginUser(req, res);
})

router.post('/logout', (req, res) => {
    logoutUser(req, res);
})

router.get('/', authenticate, (req, res) => {
    // Remove the user's hashed password from the response
    const user = { id: req.user.id, username: req.user.username, account_type: req.user.account_type };
    res.status(200).json(user);
})

router.delete('/delete', authenticate, (req, res) => {
    deleteUser(req, res);
})

router.put('/update', authenticate, (req, res) => {
    const { toUpdate } = req.body;
    if (toUpdate === 'username') {
        const { newUsername } = req.body;
        if (!newUsername) {
            return res.status(400).json({ message: 'New username is required' });
        }
        updateUsername(req, res);
    } else if (toUpdate === 'password') {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }
        updatePassword(req, res);
    } else if (toUpdate === 'account_type') {
        const { userIdToUpdate, newAccountType } = req.body;
        if (!userIdToUpdate || !newAccountType) {
            return res.status(400).json({ message: 'User ID and new account type are required' });
        }
        updateAccountType(req, res);
    } else {
        return res.status(400).json({ message: 'Invalid update type' });
    }
})

router.get('/all', (req, res) => {
    getAllUsers(req, res);
})

export default router;