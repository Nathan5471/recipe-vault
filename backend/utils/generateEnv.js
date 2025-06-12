import fs from 'fs';
import crypto from 'crypto';

export default function generateEnv() {
    if (fs.existsSync('.env')) {
        console.log('.env file already exists. Skipping generation.');
        return;
    }
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const envContent = `JWT_SECRET=${jwtSecret}`;
    fs.writeFile('.env', envContent, (error) => {
        if (error) {
            console.error('Error writing .env file:', error);
        } else {
            console.log('.env file created successfully.');
        }
    })
}