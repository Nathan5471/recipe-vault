import express from 'express';
import setupDatabase from './utils/sqliteDbSetup.js';

const app = express();
const PORT = 3000;
app.use(express.json());

try {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        setupDatabase();
    })
} catch (error) {
    console.error('Error starting server:', error);
}