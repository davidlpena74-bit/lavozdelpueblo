
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// REAL Service Role Key provided by user
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabaseUrl = process.env.VITE_SUPABASE_URL;

const supabase = createClient(supabaseUrl, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function deleteTopic() {
    const titleToDelete = '¿Referéndum sobre la forma de Estado (Monarquía/República)?';

    console.log(`[SERVICE ROLE] Deleting: "${titleToDelete}"`);

    const { data, error } = await supabase
        .from('topics')
        .delete()
        .eq('title', titleToDelete)
        .select();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! Deleted count:', data.length);
        if (data.length > 0) console.log('Deleted item:', data[0].title);
        else console.log('Item not found (maybe executed query before?)');
    }
}

deleteTopic();
