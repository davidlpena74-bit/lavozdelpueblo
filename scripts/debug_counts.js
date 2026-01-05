
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

async function checkVotes() {
    console.log('Counting TOTAL VOTES...');
    const { count: voteCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });

    console.log(`🗳️ Total Votes in DB: ${voteCount}`);

    console.log('Counting PROFILES...');
    const { count: profileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    console.log(`👤 Total Profiles in DB: ${profileCount}`);
}

checkVotes();
