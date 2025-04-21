import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMessage, handleLogin } from './auth.js';

dotenv.config();

const app = express();

// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());
app.use(express.json());

// Endpoint to get a message for signing
app.get('/auth/message', (req, res) => {
    const message = generateMessage();
    res.json({ message });
});

// Endpoint to authenticate with MetaMask
app.post('/auth/login', async (req, res) => {
    const { metamask_address, message, signature } = req.body;

    const result = await handleLogin(metamask_address, message, signature);

    return res.status(result.status).json(result.error ? { error: result.error } : result.data);
});

// ... (Other API endpoints)

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});