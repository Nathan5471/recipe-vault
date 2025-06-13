import express from 'express';
import authenticate from '../middleware/authenticate.js';
import { createRecipe, updateRecipe, deleteRecipes } from '../controllers/recipeController.js';
import { verifyIngredients, verifyInstructions } from '../utils/formatVerifier';

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
    deleteRecipes(req, res);
})

router.get('/:id'), (req, res) => {
    // IMPLEMENT
}

router.get('/all/:limit', (req, res) => {
    // IMPLEMENT
})

router.get('/search/:query', (req, res) => {
    // IMPLEMENT
})

router.get('/favorites', (req, res) => {
    // IMPLEMENT
})

router.post('/addRemoveFavorite', (req, res) => {
    // IMPLEMENT
})
