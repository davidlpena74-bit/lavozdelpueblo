
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkArgumentCounts() {
    // 1000 limit is fine for 57 topics
    const { data: topics, error } = await supabase
        .from('topics')
        .select('id, title, pros, cons');

    if (error) {
        console.error(error);
        return;
    }

    const defective = topics.filter(t =>
        (t.pros || []).length < 3 || (t.cons || []).length < 3
    );

    console.log(`checked ${topics.length} topics.`);
    console.log(`Found ${defective.length} topics with < 3 args.`);

    if (defective.length > 0) {
        console.log('Sample defective:', defective[0].title);
        console.log('Pros:', defective[0].pros);
        console.log('Cons:', defective[0].cons);
    }
}

checkArgumentCounts();
