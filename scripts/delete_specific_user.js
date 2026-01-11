
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Admin Key needed to delete from auth.users
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

const TARGET_EMAIL = 'davidlopezpena@hotmail.com';

async function deleteUser() {
    console.log(`Searching for user: ${TARGET_EMAIL}...`);

    // 1. Find User ID
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const targetUser = users.find(u => u.email === TARGET_EMAIL);

    if (!targetUser) {
        console.log('User not found in Auth system.');
        return;
    }

    console.log(`Found User ID: ${targetUser.id}`);

    // 2. Delete User (This should cascade delete from public.profiles and comments due to FK constraints)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUser.id);

    if (deleteError) {
        console.error('Error deleting user:', deleteError);
    } else {
        console.log('✅ User deleted successfully from Auth and cascade tables.');
    }
}

deleteUser();
