
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAvatars() {
    const { data: comments } = await supabase
        .from('comments')
        .select(`
            profiles:user_id (
                avatar_url
            )
        `)
        .limit(100);

    let noSeed = 0;
    comments.forEach(c => {
        if (!c.profiles?.avatar_url?.includes('seed=')) {
            noSeed++;
            console.log("Found profile without seed:", c.profiles);
        }
    });

    console.log(`Checked 100 comments. Found ${noSeed} without seed.`);
}

checkAvatars();
