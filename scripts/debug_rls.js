
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Using the PUBLIC anon key (simulating a real user on the web)
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.VITE_SUPABASE_URL, ANON_KEY);

async function testPublicAccess() {
    console.log('Testing PUBLIC (Anonymous) access to [topics]...');

    // Try to fetch topics as a guest
    const { data, error, count } = await supabase
        .from('topics')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('❌ Error fetching topics as Anon:', error.message);
    } else {
        console.log(`✅ Success! Visible topics for Anon: ${data.length}`);
        if (data.length > 0) console.log('Sample:', data[0].title);
    }

    // Try to fetch counts/votes
    console.log('\nTesting PUBLIC access to [topics_with_stats] view...');
    const { data: viewData, error: viewError } = await supabase
        .from('topics_with_stats')
        .select('*')
        .limit(5);

    if (viewError) {
        console.error('❌ Error fetching VIEW as Anon:', viewError.message);
    } else {
        console.log(`✅ Success! Visible view rows: ${viewData.length}`);
    }
}

testPublicAccess();
