
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectView() {
    console.log('Fetching topic from VIEW...');
    const { data, error } = await supabase
        .from('topics_with_stats')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns returned by view:', Object.keys(data));
        console.log('Pros:', data.pros);
        console.log('Cons:', data.cons);
        console.log('Analysis:', data.ai_analysis);
    }
}

inspectView();
