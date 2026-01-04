
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env manualy since we are running a script
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking connection to:', supabaseUrl);

    // Try to select from votes
    console.log('Querying public.votes...');
    const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .limit(1);

    if (votesError) {
        console.error('Error querying votes:', votesError.message);
        if (votesError.code) console.error('Error code:', votesError.code);
    } else {
        console.log('Success! Found votes table. Rows:', votes.length);
    }

    // Try to select from topics
    console.log('Querying public.topics...');
    const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .limit(1);

    if (topicsError) {
        console.error('Error querying topics:', topicsError.message);
    } else {
        console.log('Success! Found topics table. Rows:', topics.length);
    }
}

checkTables();
