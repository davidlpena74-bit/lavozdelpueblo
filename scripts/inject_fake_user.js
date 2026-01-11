
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

async function injectFakeProfile() {
    const email = `fakeuser_${Date.now()}@test.com`;
    console.log(`Creating auth user: ${email}`);

    // 1. Create User in Auth
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { region: 'MD' }
    });

    if (authError) {
        console.error("Error creating auth user:", authError);
        return;
    }

    console.log(`Auth user created: ${user.id}`);

    // 2. Try to insert profile (or check if trigger did it)
    console.log("Attempting manual profile injection...");
    const { error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            region: 'MD',
            is_fake: true
        });

    if (error) {
        if (error.code === '23505') {
            console.log("✅ Profile already existed (Trigger worked!).");
        } else {
            console.error("Error injecting profile:", error);
        }
    } else {
        console.log("✅ Fake profile injected manually!");
    }

    console.log("Refresh browser to see count increase.");
}

injectFakeProfile();
