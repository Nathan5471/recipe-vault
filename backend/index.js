import express from 'express';
import cookieParser from 'cookie-parser';
import setupDatabase from './utils/sqliteDbSetup.js';
import generateEnv from './utils/generateEnv.js';
import authRouter from './routes/authRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

try {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
        setupDatabase();
        generateEnv();
    })
} catch (error) {
    console.error('Error starting server:', error);
}