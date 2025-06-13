import sqlite3 from 'sqlite3';

export default function setupDatabase() {
    const db = new sqlite3.Database('data/database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the recipes database.');
        }
    });

    // favorite_recipes should be stored in the format [recipeId1, recipeId2, ...]
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            account_type TEXT NOT NULL CHECK(account_type IN ('admin', 'user')),
            favorite_recipes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`)


    // ingredients should be stored in the format [{name: 'ingredient1', quantity: 'number', unit: 'unit'}, ...]
    // instructions should be stored in the format [step1, step2, ...]
    db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`)

    db.run(`CREATE INDEX IF NOT EXISTS index_recipes_title ON recipes(title)`);
    db.run(`CREATE INDEX IF NOT EXISTS index_recipes_user_id ON recipes(user_id)`);

    db.close((error) => {
        if (error) {
            console.error('Error closing database:', error.message);
        } else {
            console.log('Database connection closed.');
        }
    })
}