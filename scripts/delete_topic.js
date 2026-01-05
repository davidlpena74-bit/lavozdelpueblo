
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function deleteTopic() {
    const titleToDelete = '¿Referéndum sobre la forma de Estado (Monarquía/República)?';

    console.log(`Attempting to delete: "${titleToDelete}"`);

    // Note: This operation might fail if RLS policies do not allow anonymous/public deletion.
    // Usually DELETE requires strong authentication or Service Role.
    const { data, error } = await supabase
        .from('topics')
        .delete()
        .eq('title', titleToDelete)
        .select();

    if (error) {
        console.error('Error deleting topic:', error.message);
        console.error('Hint: You likely need to run this in the Supabase SQL Editor because RLS prevents deleting via the API without Admin privileges.');
    } else if (data && data.length > 0) {
        console.log('Success! Topic deleted:', data);
    } else {
        console.log('No matching topic found or deletion silently failed (RLS).');
    }
}

deleteTopic();
