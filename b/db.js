import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if user exists by metamask address
export async function getUserByMetamaskAddress(metamask_address) {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('metamask_address', metamask_address)
        .maybeSingle();

    return { user, error };
}

// Update user session
export async function updateUserSession(userId, session_id) {
    const { error } = await supabase
        .from('users')
        .update({ session_id })
        .eq('id', userId);

    return { error };
}

// Create new user
export async function createUser(metamask_address) {
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ metamask_address, email: null, signup_timestamp: new Date() }])
        .select()
        .single();

    return { newUser, error };
} 