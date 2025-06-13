import sqlite3 from 'sqlite3';

export const createRecipe = (req, res) => {
    const { title, description, ingredients, instructions } = req.body;
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.run(`INSERT INTO recipes (title, description, ingredients, instructions, user_id) VALUES (?, ?, ?, ?, ?)`, [title, description, ingredients, instructions, userId], (error) => {
        if (error) {
            console.error('Error inserting recipe:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to create recipe' });
        }
        res.status(201).json({ message: 'Recipe created successfully' });
        db.close();
    })
}

export const updateRecipe = (req, res) => {
    const { id, title, description, ingredients, instructions } = req.body;
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT * FROM recipes WHERE id = ?`, [id], (error, row) => {
        if (error) {
            console.error('Error fetching recipe:', error.message);
            db.close();
            return 
        }
        if (!row) {
            db.close();
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if (row.user_id !== userId) {
            db.close();
            return res.status(403).json({ message: 'You do not have permission to update this recipe' });
        }
        db.run(`UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?  WHERE id = ?`, [title, ingredients, instructions, description, id], (error) => {
            if (error) {
                console.error('Error updating recipe:', error.message);
                db.close();
                return res.status(500).json({ message: 'Failed to update recipe' });
            }
            res.status(200).json({ message: 'Recipe updated successfully' });
            db.close();
        })     
    })
}

export const deleteRecipe = (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT * FROM recipes WHERE id = ?`, [id], (error, row) => {
        if (error) {
            console.error('Error fetching recipe:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to delete recipe' });
        }
        if (!row) {
            db.close();
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if (row.user_id !== userId) {
            db.close();
            return res.status(403).json({ message: 'You do not have permission to delete this recipe' });
        }
        db.run(`DELETE FROM recipes WHERE id = ?`, [id], (error) => {
            if (error) {
                console.error('Error deleting recipe:', error.message);
                db.close();
                return res.status(500).json({ message: 'Failed to delete recipe' });
            }
        })
    })
}

export const getRecipeById = (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT * FROM recipes WHERE id = ?`, [id], (error, row) => {
        if (error) {
            console.error('Error fetching recipe:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to fetch recipe' });
        }
        if (!row) {
            db.close();
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(row);
        db.close();
    })
}

export const getAllRecipes = (req, res) => {
    const { limit } = req.params;
    const db = new sqlite3.Database('data/database.db');
    db.all(`SELECT * FROM recipes LIMIT ?`, [limit], (error, rows) => {
        if (error) {
            console.error('Error fetching recipes:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to fetch recipes' });
        }
        res.status(200).json(rows);
        db.close();
    })
}

export const getUserRecipes = (req, res) => {
    const userId = req.params.userId
    const db = new sqlite3.Database('data/database.db');
    db.all(`SELECT * FROM recipes WHERE user_id = ?`, [userId], (error, rows) => {
        if (error) {
            console.error('Error fetching user recipes:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to fetch user recipes' });
        }
        res.status(200).json(rows);
        db.close();
    })
}

export const searchRecipes = (req, res) => {
    const { query } = req.params;
    const db = new sqlite3.Database('data/database.db');
    db.all(`SELECT * FROM recipes WHERE title LIKE ?`, [`%${query}%`], (error, recipes) => {
        if (error) {
            console.error('Error searching recipes:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to search recipes' });
        }
        res.status(200).json(recipes);
        db.close();
    })
}

export const getUserFavorites = (req, res) => {
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT favorite_recipes FROM users WHERE id = ?`, [userId], (error, row) => {
        if (error) {
            console.error('Error fetching user favorites:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to fetch user favorites' });
        }
        if (!row) {
            db.close();
            return res.status(404).json({ message: 'User not found' });
        }
        const favoriteRecipes = row.favorite_recipes ? JSON.parse(row.favorite_recipes) : [];
        db.all(`SELECT * FROM recipes WHERE id IN (${favoriteRecipes.join(',')})`, (error, recipes) => {
            if (error) {
                console.error('Error fetching favorite recipes:', error.message);
                db.close();
                return res.status(500).json({ message: 'Failed to fetch favorite recipes' });
            }
            res.status(200).json(recipes);
            db.close();
        });
    })
}

export const addRemoveFavorite = (req, res) => {
    const { recipeId } = req.body;
    const userId = req.user.id;
    const db = new sqlite3.Database('data/database.db');
    db.get(`SELECT favorite_recipes FROM users WHERE id = ?`, [userId], (error, row) => {
        if (error) {
            console.error('Error fetching user favorites:', error.message);
            db.close();
            return res.status(500).json({ message: 'Failed to fetch user favorites' });
        }
        if (!row) {
            db.close();
            return res.status(404).json({ message: 'User not found' });
        }
        let favoriteRecipes = row.favorite_recipes ? JSON.parse(row.favorite_recipes) : [];
        const index = favoriteRecipes.indexOf(recipeId);
        if (index > -1) {
            favoriteRecipes.splice(index, 1); // Remove recipe from favorites
        } else {
            favoriteRecipes.push(recipeId); // Add recipe to favorites
        }
        db.run(`UPDATE users SET favorite_recipes = ? WHERE id = ?`, [JSON.stringify(favoriteRecipes), userId], (error) => {
            if (error) {
                console.error('Error updating user favorites:', error.message);
                db.close();
                return res.status(500).json({ message: 'Failed to update user favorites' });
            }
            res.status(200).json({ message: 'Favorites updated successfully', favoriteRecipes });
            db.close();
        });
    })
}