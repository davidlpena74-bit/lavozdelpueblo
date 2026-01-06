
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Use ANON key to simulate frontend/public access
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugFetch() {
    console.log("Fetching topics...");
    const { data: topics } = await supabase.from('topics').select('id, title').limit(1);
    const topicId = topics[0].id;

    console.log(`Trying to fetch comments for topic: ${topics[0].title} (${topicId})`);

    const { data, error } = await supabase
        .from('comments')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
                region,
                avatar_url
                )
        `)
        .eq('topic_id', topicId);

    if (error) {
        console.error("❌ ERROR FETCHING:", error);
    } else {
        console.log(`✅ Success! Found ${data.length} comments.`);
        if (data.length > 0) {
            console.log("Sample:", data[0]);
        }
    }
}

debugFetch();
