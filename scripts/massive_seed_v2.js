
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const NAMES = ['Antonio', 'Manuel', 'Jose', 'Francisco', 'David', 'Juan', 'Javier', 'Jose Antonio', 'Daniel', 'Francisco Javier', 'Maria', 'Carmen', 'Ana', 'Isabel', 'Dolores', 'Pilar', 'Teresa', 'Rosa', 'Cristina', 'Angeles', 'Laura', 'Elena', 'Marta', 'Lucia', 'Paula', 'Sofia', 'Carlos', 'Alejandro', 'Pedro', 'Miguel', 'Rafael', 'Luis', 'Angel', 'Miguel Angel', 'Pablo', 'Sergio', 'Jesus', 'Jorge'];
const SURNAMES = ['Garcia', 'Gonzalez', 'Rodriguez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Gomez', 'Martin', 'Jimenez', 'Ruiz', 'Hernandez', 'Diaz', 'Moreno', 'Muñoz', 'Alvarez', 'Romero', 'Alonso', 'Gutierrez', 'Navarro', 'Torres', 'Dominguez', 'Vazquez', 'Ramos', 'Gil', 'Ramirez', 'Serrano', 'Blanco', 'Molina', 'Morales', 'Suarez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marin', 'Sanz'];

const REGIONS = [
    { code: 'AN', weight: 18 }, { code: 'CT', weight: 16 }, { code: 'MD', weight: 14 }, { code: 'VC', weight: 10 },
    { code: 'GA', weight: 6 }, { code: 'CL', weight: 5 }, { code: 'PV', weight: 5 }, { code: 'CN', weight: 5 },
    { code: 'CM', weight: 4 }, { code: 'MC', weight: 3 }, { code: 'AR', weight: 3 }, { code: 'IB', weight: 2 },
    { code: 'EX', weight: 2 }, { code: 'AS', weight: 2 }, { code: 'NC', weight: 1 }, { code: 'CB', weight: 1 },
    { code: 'RI', weight: 1 }, { code: 'CE', weight: 0.5 }, { code: 'ML', weight: 0.5 }
];
const OCCUPATIONS = ['Estudiante', 'Desempleado', 'Trabajador Manual / Obrero', 'Trabajador Servicios / Administrativo', 'Profesional Técnico / Autónomo', 'Directivo / Empresario', 'Jubilado', 'Otras'];
const GENDERS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getWeightedRegion = () => {
    const totalWeight = REGIONS.reduce((s, r) => s + r.weight, 0);
    let r = Math.random() * totalWeight;
    for (const region of REGIONS) {
        if (r < region.weight) return region.code;
        r -= region.weight;
    }
    return 'MD';
};
const getAge = () => {
    const r = Math.random();
    if (r < 0.1) return Math.floor(16 + Math.random() * 9); // 16-24 (10%)
    if (r < 0.4) return Math.floor(25 + Math.random() * 20); // 25-44 (30%)
    if (r < 0.7) return Math.floor(45 + Math.random() * 20); // 45-64 (30%)
    return Math.floor(65 + Math.random() * 25); // 65+ (30%)
};

async function main() {
    const TARGET_USERS = 6794;

    console.log('Fetching topics...');
    const { data: topics } = await supabase.from('topics').select('id');
    if (!topics?.length) return console.error('No topics found!');

    console.log(`Starting generation of ${TARGET_USERS} users...`);
    let createdCount = 0;
    const CHUNK_SIZE = 5; // Reduced parallelism to avoid rate limits

    for (let i = 0; i < TARGET_USERS; i += CHUNK_SIZE) {
        const chunkPromises = [];
        for (let j = 0; j < CHUNK_SIZE; j++) {
            if (i + j >= TARGET_USERS) break;
            chunkPromises.push(processUser(topics));
        }
        await Promise.all(chunkPromises);
        createdCount += chunkPromises.length;
        process.stdout.write(`\rCreated: ${createdCount}/${TARGET_USERS}`);
        // Small delay to be nice to API
        await new Promise(r => setTimeout(r, 100));
    }
    console.log('\nDone! 🎉');
}

async function processUser(topics) {
    const firstName = getRandom(NAMES);
    const lastName = `${getRandom(SURNAMES)} ${getRandom(SURNAMES)}`;
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/ /g, '')}.${Math.floor(Math.random() * 9999999)}@fake.local`
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { username: fullName }
    });

    if (authError || !authData.user) return; // Skip if failed
    const userId = authData.user.id;

    // 2. Upsert Profile (Force create)
    const profile = {
        name: fullName,
        region: getWeightedRegion(),
        age: getAge(),
        occupation: getRandom(OCCUPATIONS),
        gender: getRandom(GENDERS),
        is_fake: true,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
    };

    await supabase.from('profiles').upsert({
        id: userId,
        ...profile
    });

    // 3. Cast Votes
    const votesToCast = [];
    for (const topic of topics) {
        if (Math.random() > 0.6) { // 40% chance to vote
            const r = Math.random();
            let choice = 'neutral';
            if (r < 0.45) choice = 'support';
            else if (r < 0.90) choice = 'oppose'; // Less neutrals

            votesToCast.push({
                user_id: userId,
                topic_id: topic.id,
                choice: choice,
                region: profile.region
            });
        }
    }

    if (votesToCast.length > 0) {
        await supabase.from('votes').insert(votesToCast);
    }
}

main();
