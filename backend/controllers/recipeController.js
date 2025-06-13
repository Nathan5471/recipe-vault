import sqlite3 from 'sqlite3';

export const createRecipe = (req, res) => {
    const { title, ingredients, instructions } = req.body;
    const description = req.body.description || '';
    const userId = req.user.id;
    const db = new sqlite3.Database('recipes.db');
    db.run(`INSERT INTO recipes (title, ingredients, instructions, description, user_id) VALUES (?, ?, ?, ?, ?)`, [title, ingredients, instructions, description, userId], (error) => {
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
    const { id, title, ingredients, instructions } = req.body;
    const description = req.body.description || '';
    const userId = req.user.id;
    const db = new sqlite3.Database('recipes.db');
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
        db.run(`UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, description = ? WHERE id = ?`, [title, ingredients, instructions, description, id], (error) => {
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
    const db = new sqlite3.Database('recipes.db');
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