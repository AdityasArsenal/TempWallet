import express from 'express';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors'; // Import the cors middleware

const app = express();

// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());
app.use(express.json());

// Initialize Supabase (replace with your URL and Key)
const supabaseUrl = 'https://mblhdwjwizxgrbgxkmyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibGhkd2p3aXp4Z3JiZ3hrbXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODg0MDcxMiwiZXhwIjoyMDU0NDE2NzEyfQ.7JAJFeZ-2BpBtHBB_ACv3BjWo9IU_WOk58QxI1afZ_k';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a random message (nonce)
function generateMessage() {
    return uuidv4();
}

// Endpoint to get a message for signing
app.get('/auth/message', (req, res) => {
    const message = generateMessage();
    // Store the message temporarily (e.g., in memory or a short-lived cache)
    // You'll need to retrieve this message later to verify the signature
    // For simplicity, we're not storing it in this example, but you MUST in production!
    res.json({ message });
});

// Endpoint to authenticate with MetaMask
app.post('/auth/login', async (req, res) => {
    const { metamask_address, message, signature } = req.body; // Removed userName

    if (!metamask_address || !message || !signature) { // Removed userName check
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        // 1. Verify the signature
        const signerAddress = ethers.verifyMessage(message, signature);

        if (signerAddress.toLowerCase() !== metamask_address.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // 2. Check if the user exists in the database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('metamask_address', metamask_address)
            .maybeSingle(); // Use maybeSingle() instead of single()

        if (userError) {
            // Log the error but proceed if it's just 'not found'
            console.error('Database lookup error:', userError);
            // A more specific check could be done here if needed, e.g. checking error code
            // For now, we assume any error here is potentially problematic if user is also null
            if (!user) {
                return res.status(500).json({ error: 'Database lookup failed' });
            }
            // If user exists despite the error, log it and proceed (less likely scenario)
        }

        if (user) {
            // User exists - create a session ID
            const session_id = uuidv4();
            console.log('Session ID:', session_id);
            console.log('User is a good boy');
            const { error: sessionError } = await supabase
                .from('users')
                .update({ session_id })
                .eq('id', user.id);

            if (sessionError) {
                console.error('Session update error:', sessionError);
                return res.status(500).json({ error: 'Session update error' });
            }
            return res.json({ session_id });
        } else {
            // User doesn't exist - create a new user
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([{ metamask_address, email: null, signup_timestamp: new Date() }]) // Removed userName
                .select()
                .single();

            if (insertError) {
                console.error('Error creating new user:', insertError);
                return res.status(500).json({ error: 'Failed to create new user' });
            }

            if (newUser) {
                const session_id = uuidv4();
                console.log('Session ID:', session_id);
                console.log('User is a good boy');
                const { error: sessionError } = await supabase
                    .from('users')
                    .update({ session_id })
                    .eq('id', newUser.id);

                if (sessionError) {
                    console.error('Session update error:', sessionError);
                    return res.status(500).json({ error: 'Session update error' });
                }
                return res.json({ session_id });
            } else {
                return res.status(500).json({ error: 'Failed to create and retrieve new user' });
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
});

// ... (Other API endpoints)

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});