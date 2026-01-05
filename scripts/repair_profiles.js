
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
    if (r < 0.1) return Math.floor(16 + Math.random() * 9);
    if (r < 0.4) return Math.floor(25 + Math.random() * 20);
    if (r < 0.7) return Math.floor(45 + Math.random() * 20);
    return Math.floor(65 + Math.random() * 25);
};

async function repairProfiles() {
    console.log('Fetching all distinct user IDs from votes...');

    // Pagination needed because .select is limited to 1000 rows by default
    // But distinct user_id query is tricky via API.
    // Simpler approach: Fetch ALL votes (heavy but works for 140k), extract unique IDs
    // OR: Fetch 'auth.users' directly if possible via admin API!

    // Better path: List all Auth Users via Admin API. They definitely exist there.
    let allUsers = [];
    let page = 1;
    let hasMore = true;

    console.log('Fetching Auth Users...');
    while (hasMore) {
        const { data, error } = await supabase.auth.admin.listUsers({
            page: page,
            perPage: 1000
        });

        if (error) {
            console.error(error);
            break;
        }

        allUsers = allUsers.concat(data.users);
        if (data.users.length < 1000) hasMore = false;
        else {
            process.stdout.write(`\rFetched ${allUsers.length} users...`);
            page++;
        }
    }
    console.log(`\nFound ${allUsers.length} total users in Auth.`);

    console.log('Checking which ones populate Profiles...');
    // We already know only 1 exists, but let's just Upsert everyone just in case.

    let repairedCount = 0;
    const CHUNK_SIZE = 20;

    for (let i = 0; i < allUsers.length; i += CHUNK_SIZE) {
        const usersChunk = allUsers.slice(i, i + CHUNK_SIZE);
        const upsertData = usersChunk.map(user => {
            // Generate logic only if missing metadata, but usually user_metadata has username
            let fullName = user.user_metadata?.username;
            if (!fullName) {
                const firstName = getRandom(NAMES);
                const lastName = `${getRandom(SURNAMES)} ${getRandom(SURNAMES)}`;
                fullName = `${firstName} ${lastName}`;
            }

            return {
                id: user.id,
                region: getWeightedRegion(),
                age: getAge(),
                occupation: getRandom(OCCUPATIONS),
                gender: getRandom(GENDERS),
                is_fake: true,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
            };
        });

        // Bulk Upsert in Profiles
        const { error } = await supabase.from('profiles').upsert(upsertData);

        if (error) {
            console.error('Error upserting chunk:', error.message);
        } else {
            repairedCount += usersChunk.length;
            process.stdout.write(`\rRepaired Profiles: ${repairedCount} / ${allUsers.length}`);
        }
    }
    console.log('\nRepair Complete! 🎉');
}

repairProfiles();
