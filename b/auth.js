import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { getUserByMetamaskAddress, updateUserSession, createUser } from './db.js';

// Function to generate a random message (nonce)
export function generateMessage() {
    return uuidv4();
}

// Verify signature
export function verifySignature(message, signature) {
    return ethers.verifyMessage(message, signature);
}

// Handle login
export async function handleLogin(metamask_address, message, signature) {
    console.log("message before verification:", message);
    console.log("signature before verification:", signature);

    if (!metamask_address || !message || !signature) {
        return { status: 400, error: 'Missing parameters' };
    }

    try {
        // 1. Verify the signature
        const signerAddress = verifySignature(message, signature);
        console.log("PublicAddress (the address that signed the message according to the function):", signerAddress);
        console.log("metamask_address(the address that is logged in):", metamask_address);

        if (signerAddress.toLowerCase() !== metamask_address.toLowerCase()) {
            return { status: 401, error: 'Invalid signature' };
        }

        // 2. Check if the user exists in the database
        const { user, error: userError } = await getUserByMetamaskAddress(metamask_address);

        if (userError) {
            console.error('Database lookup error:', userError);
            if (!user) {
                return { status: 500, error: 'Database lookup failed' };
            }
        }

        if (user) {
            // User exists - create a session ID
            const session_id = uuidv4();
            console.log('Session ID:', session_id);
            console.log('User is a good boy');

            const { error: sessionError } = await updateUserSession(user.id, session_id);

            if (sessionError) {
                console.error('Session update error:', sessionError);
                return { status: 500, error: 'Session update error' };
            }
            return { status: 200, data: { session_id } };
        } else {
            // User doesn't exist - create a new user
            const { newUser, error: insertError } = await createUser(metamask_address);

            if (insertError) {
                console.error('Error creating new user:', insertError);
                return { status: 500, error: 'Failed to create new user' };
            }

            if (newUser) {
                const session_id = uuidv4();
                console.log('Session ID:', session_id);
                console.log('User is a good boy');

                const { error: sessionError } = await updateUserSession(newUser.id, session_id);

                if (sessionError) {
                    console.error('Session update error:', sessionError);
                    return { status: 500, error: 'Session update error' };
                }
                return { status: 200, data: { session_id } };
            } else {
                return { status: 500, error: 'Failed to create and retrieve new user' };
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return { status: 500, error: 'Authentication error' };
    }
} 