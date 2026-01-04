
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLabels() {
    console.log('Checking custom labels in topics_with_stats view...');
    const { data: topics, error } = await supabase
        .from('topics_with_stats')
        .select('title, label_support, label_oppose')
        .limit(5);

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Topics found:', topics.length);
        topics.forEach(t => {
            console.log(`Topic: ${t.title}`);
            console.log(`  Support Label: ${t.label_support}`);
            console.log(`  Oppose Label: ${t.label_oppose}`);
        });
    }
}

checkLabels();
