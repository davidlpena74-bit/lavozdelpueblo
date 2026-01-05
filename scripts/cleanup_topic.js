
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

async function cleanup() {
    console.log('Searching for topics containing "Monarquía"...');

    // First, list them to be sure
    const { data: found } = await supabase
        .from('topics')
        .select('id, title')
        .ilike('title', '%Monarquía%');

    console.log('Found matches:', found);

    if (found && found.length > 0) {
        // Delete them
        for (const topic of found) {
            console.log(`Deleting: ${topic.title}`);
            await supabase.from('topics').delete().eq('id', topic.id);
        }
        console.log('Cleaned up!');
    } else {
        console.log('Nothing to delete.');
    }
}

cleanup();
