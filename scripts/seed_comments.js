
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Service Key to bypass RLS and insert comments for other users
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

const COMMENTS_POOL = {
    support: [
        "Totalmente de acuerdo. Es el camino a seguir.",
        "Ya era hora de que se planteara esto seriamente.",
        "En mi opinión, esto traerá muchos beneficios a largo plazo.",
        "Sí, rotundamente. El país necesita avanzar en esta dirección.",
        "Buena propuesta. Tenéis mi apoyo.",
        "Es de sentido común. No entiendo la oposición a esto.",
        "Por fin alguien pone este tema sobre la mesa.",
        "Creo que es una medida necesaria y urgente.",
        "Ojalá se apruebe pronto.",
        "Desde luego, es mucho mejor que lo que tenemos ahora."
    ],
    oppose: [
        "No lo veo claro. Me parece arriesgado.",
        "Estoy totalmente en contra. Esto nos va a perjudicar.",
        "Es un error histórico si seguimos por aquí.",
        "No creo que sea la solución real al problema.",
        "Esto solo va a crear más división.",
        "Me parece una medida populista sin base técnica.",
        "No con mis impuestos. En contra.",
        "Sinceramente, creo que hay prioridades más urgentes.",
        "Esto no funcionó en otros países, ¿por qué aquí sí?",
        "Demasiada burocracia para tan poco resultado."
    ],
    neutral: [
        "Es un tema complejo, tiene sus luces y sus sombras.",
        "Necesito más información antes de decidirme.",
        "La idea es buena, pero la ejecución me preocupa.",
        "Depende de los detalles de la ley.",
        "Hay argumentos válidos en ambos lados.",
        "Interesante debate. Seguiré atento.",
        "No estoy seguro de si es el momento adecuado.",
        "Habría que buscar un consenso más amplio.",
        "Ni blanco ni negro, hay muchos matices aquí.",
        "Me gustaría ver un estudio de impacto primero."
    ]
};

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedComments() {
    console.log("Cargando topics y usuarios...");

    // 1. Fetch Topics
    const { data: topics, error: topicsError } = await supabase.from('topics').select('id, title');
    if (topicsError) throw topicsError;

    // 2. Fetch a sample of Users (we can't fetch all 6000 easily, let's just grab 200 random ones effectively? 
    // Actually standard fetch limit is 1000. Let's grab 500.)
    const { data: users, error: usersError } = await supabase.from('profiles').select('id').limit(500);
    if (usersError) throw usersError;

    if (!users || users.length === 0) {
        console.error("No users found to comment!");
        return;
    }

    console.log(`Found ${topics.length} topics and ${users.length} users available.`);

    let allComments = [];

    // 3. Generate comments for each topic
    for (const topic of topics) {
        // Random number of comments between 3 and 12 per topic
        const numComments = Math.floor(Math.random() * 10) + 3;

        for (let i = 0; i < numComments; i++) {
            // Pick random user
            const user = users[Math.floor(Math.random() * users.length)];

            // Pick random stance
            const stance = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'support' : 'oppose') : 'neutral';

            // Pick random text
            const textPool = COMMENTS_POOL[stance];
            const content = textPool[Math.floor(Math.random() * textPool.length)];

            // Pick random date in last 30 days
            const createdAt = getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

            allComments.push({
                topic_id: topic.id,
                user_id: user.id,
                content: content,
                created_at: createdAt.toISOString()
            });
        }
    }

    console.log(`Generated ${allComments.length} comments. Inserting...`);

    // 4. Batch Insert
    // Supabase can handle batch inserts, but let's do chunks of 100 just in case
    const chunkSize = 100;
    for (let i = 0; i < allComments.length; i += chunkSize) {
        const chunk = allComments.slice(i, i + chunkSize);
        const { error } = await supabase.from('comments').insert(chunk);

        if (error) {
            console.error('Error inserting chunk:', error);
        } else {
            console.log(`Inserted chunk ${i / chunkSize + 1}`);
        }
    }

    console.log("✅ Seed complete!");
}

seedComments();
