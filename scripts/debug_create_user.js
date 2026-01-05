
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';

// IMPORTANT: Enable explicit debug options if possible, but standard storage is fine
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function debugCreateUser() {
    const email = `test.user.${Date.now()}@fake.local`;
    console.log(`Attempting to create user: ${email}`);

    // 1. Create in AUTH
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { username: 'Test User Debug' }
    });

    if (authError) {
        console.error('❌ AUTH CREATION FAILED:', authError.message);
        return;
    }
    console.log('✅ Auth User Created. ID:', authData.user.id);
    const userId = authData.user.id;

    // 2. Wait a second for Triggers (if any)
    await new Promise(r => setTimeout(r, 2000));

    // 3. Check if profile exists (from Trigger)
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.log('⚠️ Profile not found automatically (Trigger might be missing). Trying manual insert...');

        // Manual Insert
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                name: 'Test User Debug',
                email: email, // Assuming email column exists
                is_fake: true,
                region: 'MD'
            });

        if (insertError) {
            console.error('❌ MANUAL PROFILE INSERT FAILED:', insertError.message);
        } else {
            console.log('✅ Manual Profile Insert Success!');
        }
    } else {
        console.log('✅ Profile found (Trigger worked):', profile);
        // Try Update
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_fake: true, age: 30 })
            .eq('id', userId);

        if (updateError) console.error('❌ Update failed:', updateError.message);
        else console.log('✅ Profile Updated successfully');
    }
}

debugCreateUser();
