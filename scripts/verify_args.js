
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSpecificTopic() {
    const titleToCheck = "¿Debería ser obligatorio el voto a partir de los 16 años?";

    console.log(`Checking DB row for: "${titleToCheck}"`);

    // Check TABLE (source of truth)
    const { data: tableData } = await supabase
        .from('topics')
        .select('pros, cons')
        .eq('title', titleToCheck)
        .single();

    console.log('\n--- TABLE DATA ---');
    console.log('Pros count:', tableData?.pros?.length);
    console.log('Pros:', tableData?.pros);

    // Check VIEW (what API sees)
    const { data: viewData } = await supabase
        .from('topics_with_stats')
        .select('pros, cons')
        .eq('title', titleToCheck)
        .single();

    console.log('\n--- VIEW DATA ---');
    console.log('Pros count:', viewData?.pros?.length);
    console.log('Pros:', viewData?.pros);
}

checkSpecificTopic();
