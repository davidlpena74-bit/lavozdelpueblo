
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectAvatars() {
    console.log("Fetching sample comments with profiles...");

    // Get 5 comments
    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
            profiles:user_id (
                avatar_url
            )
        `)
        .limit(5);

    if (error) {
        console.error("Error:", error);
        return;
    }

    comments.forEach((c, idx) => {
        const url = c.profiles?.avatar_url;
        console.log(`[${idx}] URL: ${url}`);
        if (url && url.includes('seed=')) {
            const seed = url.split('seed=')[1];
            console.log(`    -> Extracted Raw: ${seed}`);
            console.log(`    -> Extracted Decoded: ${decodeURIComponent(seed)}`);
        } else {
            console.log("    -> No 'seed=' found.");
        }
    });
}

inspectAvatars();
