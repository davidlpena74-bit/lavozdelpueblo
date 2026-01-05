
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectRegionalVotes() {
    console.log('Fetching first topic to inspect regionalVotes...');

    const { data, error } = await supabase
        .from('topics_with_stats')
        .select('id, title, "regionalVotes"')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching topic:', error);
        return;
    }

    console.log('Topic Title:', data.title);
    console.log('Raw Regional Votes Type:', typeof data.regionalVotes);
    console.log('Raw Regional Votes Value:', JSON.stringify(data.regionalVotes, null, 2));
}

inspectRegionalVotes();
