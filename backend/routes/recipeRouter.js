import express from 'express';
import authenticate from '../middleware/authenticate.js';
import { createRecipe, updateRecipe, deleteRecipe, getRecipeById, getAllRecipes, searchRecipes, getUserFavorites, addRemoveFavorite, getUserRecipes } from '../controllers/recipeController.js';
import { verifyIngredients, verifyInstructions } from '../utils/formatVerifier.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

router.post('/create', authenticate, upload.single("image"), (req, res) => {
    const { title, description, ingredients, instructions } = req.body;
    const imagePath = req.file ? req.file.path : null;
    if (!title || !description || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
    }
    if (!imagePath) {
        return res.status(400).json({ message: 'Image is required' });
    }
    if (!verifyIngredients(ingredients)) {
        return res.status(400).json({ message: 'Invalid ingredients format' });
    }
    if (!verifyInstructions(instructions)) {
        return res.status(400).json({ message: 'Invalid instructions format' });
    }
    createRecipe(req, res);
})

router.put('/update', authenticate, (req, res) => {
    const { id, title, description, ingredients, instructions } = req.body;
    if (!id || !title || !description || !ingredients || !instructions) {
        return res.status(400).json({ message: 'ID, title, ingredients, and instructions are required' });
    }
    if (!verifyIngredients(ingredients)) {
        return res.status(400).json({ message: 'Invalid ingredients format' });
    }
    if (!verifyInstructions(instructions)) {
        return res.status(400).json({ message: 'Invalid instructions format' });
    }
    updateRecipe(req, res);
})

router.delete('/delete', authenticate, (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    deleteRecipe(req, res);
})

router.get('/favorites', authenticate, (req, res) => {
    getUserFavorites(req, res);
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    getRecipeById(req, res);
})

router.get('/all/:limit/:sortBy', (req, res) => {
    const { limit, sortBy } = req.params;
    if (!limit || isNaN(limit) || !sortBy) {
        return res.status(400).json({ message: 'Limit must be a valid number and sort by is required' });
    }
    getAllRecipes(req, res);
})

router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    getUserRecipes(req, res);
})

router.get('/search/:query', (req, res) => {
    const { query } = req.params;
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }
    searchRecipes(req, res);
})


router.post('/addRemoveFavorite', authenticate, (req, res) => {
    const { recipeId } = req.body;
    if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required' });
    }
    addRemoveFavorite(req, res);
})

export default router;