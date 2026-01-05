
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Use the provided secret key directly
const SERVICE_KEY = 'sb_secret_exW7fyNsjRwuEB3_loAsMQ_dKA6Qsnj';
const supabaseUrl = process.env.VITE_SUPABASE_URL;

console.log('Using Supabase URL:', supabaseUrl);
// Try to init client with this key
const supabase = createClient(supabaseUrl, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function deleteTopic() {
    const titleToDelete = '¿Referéndum sobre la forma de Estado (Monarquía/República)?';

    console.log(`[ADMIN MODE] Deleting: "${titleToDelete}"`);

    const { data, error } = await supabase
        .from('topics')
        .delete()
        .eq('title', titleToDelete)
        .select();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! Deleted:', data);
    }
}

deleteTopic();
