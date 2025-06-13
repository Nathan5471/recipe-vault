import express from 'express';
import authenticate from '../middleware/authenticate.js';
import { createRecipe, updateRecipe, deleteRecipe, getRecipeById, getAllRecipes, searchRecipes, getUserFavorites, addRemoveFavorite, getUserRecipes } from '../controllers/recipeController.js';
import { verifyIngredients, verifyInstructions } from '../utils/formatVerifier.js';

const router = express.Router();

router.post('/create', authenticate, (req, res) => {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
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
    const { id, title, ingredients, instructions } = req.body;
    if (!id || !title || !ingredients || !instructions) {
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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    getRecipeById(req, res);
})

router.get('/all/:limit', (req, res) => {
    const { limit } = req.params;
    if (!limit || isNaN(limit)) {
        return res.status(400).json({ message: 'Limit must be a valid number' });
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

router.get('/favorites', authenticate, (req, res) => {
    getUserFavorites(req, res);
})

router.post('/addRemoveFavorite', authenticate, (req, res) => {
    const { recipeId } = req.body;
    if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required' });
    }
    addRemoveFavorite(req, res);
})

export default router;