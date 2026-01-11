
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const BASE_URL = 'https://lavozdelpueblo.es';

async function generateSitemap() {
    console.log("Fetching topics for sitemap...");
    const { data: topics, error } = await supabase
        .from('topics')
        .select('id, created_at');

    if (error) {
        console.error("Error fetching topics:", error);
        return;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/latest</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

    topics.forEach(topic => {
        const lastMod = new Date(topic.created_at).toISOString().split('T')[0];
        xml += `  <url>
    <loc>${BASE_URL}/#/topic/${topic.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`✅ Sitemap generated at ${outputPath} with ${topics.length} topics.`);
}

generateSitemap();
