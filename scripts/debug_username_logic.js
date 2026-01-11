
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugUsernameLogic() {
    console.log("Fetching sample comments to test username logic...");

    const { data: comments } = await supabase
        .from('comments')
        .select(`
            user_id,
            profiles:user_id (
                avatar_url
            )
        `)
        .limit(10);

    comments.forEach((row, idx) => {
        const userId = row.user_id;
        const avatarUrl = row.profiles?.avatar_url;

        // --- LOGIC FROM api.ts ---
        let extractedName = 'Ciudadano ' + userId.slice(0, 4);

        console.log(`[${idx}] Original Avatar: ${avatarUrl}`);

        if (avatarUrl && avatarUrl.includes('seed=')) {
            try {
                const seed = avatarUrl.split('seed=')[1];
                const fullName = decodeURIComponent(seed);

                const parts = fullName.split(' ');
                if (parts.length > 0) {
                    const firstName = parts[0];
                    let suffix = '';
                    if (parts.length > 1) {
                        // Take initials of surnames
                        suffix = parts.slice(1).map(p => p[0]).join('').toUpperCase();
                    }

                    // Hash
                    let hash = 0;
                    for (let i = 0; i < userId.length; i++) {
                        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const num = Math.abs(hash % 100);

                    extractedName = `${firstName}${suffix}_${num}`;
                }
            } catch (e) {
                console.log("    ERROR in transform:", e);
            }
        } else {
            console.log("    No seed found or no avatar.");
        }

        console.log(`    RESULT: ${extractedName}`);
        console.log('-----------------------------------');
    });
}

debugUsernameLogic();
