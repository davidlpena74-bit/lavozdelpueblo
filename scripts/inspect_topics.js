
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectTopicsTable() {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Topic keys:', Object.keys(data[0]));
        console.log('Sample Data:', data[0]);
    } else {
        console.log('No topics found.');
    }
}

inspectTopicsTable();
