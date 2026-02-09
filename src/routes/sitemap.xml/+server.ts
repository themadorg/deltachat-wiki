import type { RequestHandler } from './$types';
import { fetchDocs } from '$lib/docs';

import { supportedLangCodes } from '$lib/i18n.svelte';

const SITE_URL = 'https://deltachat.wiki';
const LANGS = supportedLangCodes as unknown as string[];

export const prerender = true;

export const GET: RequestHandler = async () => {
    const urls: { loc: string; lastmod: string; priority: string; changefreq: string }[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Add root pages
    for (const lang of LANGS) {
        urls.push({
            loc: `${SITE_URL}/${lang}`,
            lastmod: today,
            priority: '1.0',
            changefreq: 'weekly'
        });
    }

    // Add all doc pages
    for (const lang of LANGS) {
        const docs = await fetchDocs(lang);
        for (const doc of docs) {
            urls.push({
                loc: `${SITE_URL}/${lang}/docs/${doc.slug}`,
                lastmod: today,
                priority: '0.8',
                changefreq: 'weekly'
            });
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
};
