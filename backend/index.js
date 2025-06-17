import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import setupDatabase from './utils/sqliteDbSetup.js';
import generateEnv from './utils/generateEnv.js';
import authRouter from './routes/authRouter.js';
import recipeRouter from './routes/recipeRouter.js';
import { nextDay } from 'date-fns';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRouter);
app.use('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    if (!imageName) {
        return res.status(400).send('Image name is required');
    }
    if (imageName === 'database.db') {
        return res.status(403).send('Access to the database file is forbidden');
    }
    const imagePath = `./data/${imageName}`;
    res.sendFile(imagePath, { root: '.' }, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('Image not found');
        }
    });
})
app.use((req, res) => {
    res.sendFile('./public/index.html', { root: '.' }, (err) => {
        if (err) {
            console.error('Error sending index file:', err);
            res.status(404).send('Page not found');
        }
    });
})

try {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        setupDatabase();
        generateEnv();
    })
} catch (error) {
    console.error('Error starting server:', error);
}