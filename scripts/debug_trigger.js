
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

async function debugInsertProfile() {
    // 1. Create a dummy Auth User (or find the one you just created)
    // Let's create a temp user just for checking trigger logic failure
    const email = `debugprofile${Date.now()}@example.org`;
    const password = 'password123';

    console.log(`Creating test user: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: 'DebugUser',
                region: 'MD'
            }
        }
    });

    if (authError) {
        console.error('Auth Signup Error:', authError);
        return;
    }

    const userId = authData.user?.id;
    console.log(`User created. ID: ${userId}`);

    // 2. Check if profile exists (did trigger work?)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profile) {
        console.log('✅ Trigger Success! Profile created automatically.');
        console.log(profile);
    } else {
        console.log('❌ Trigger FAILED. Profile not found.');

        // 3. Try manual insert to see WHY it fails
        console.log('Attempting manual insert to debug error...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                // These are fields usually copied by trigger
                // We assume trigger tries to insert ID and maybe defaults
                region: 'MD', // We explicitly provide it to match signup metadata
                is_fake: false
            });

        if (insertError) {
            console.error('Manual Insert Error:', insertError);
        } else {
            console.log('Manual Insert Success (So trigger logic is likely broken/different).');
        }
    }

    // Cleanup
    await supabase.auth.admin.deleteUser(userId);
}

debugInsertProfile();
