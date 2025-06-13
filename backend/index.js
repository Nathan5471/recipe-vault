import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import setupDatabase from './utils/sqliteDbSetup.js';
import generateEnv from './utils/generateEnv.js';
import authRouter from './routes/authRouter.js';
import recipeRouter from './routes/recipeRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRouter);
app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
}));

try {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        setupDatabase();
        generateEnv();
    })
} catch (error) {
    console.error('Error starting server:', error);
}