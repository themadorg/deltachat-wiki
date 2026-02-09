import type { RequestHandler } from './$types';
import { fetchDocs } from '$lib/docs';
import { getRawDoc } from '$lib/docs';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const docs = await fetchDocs('en');

    let output = `# Delta Chat Documentation - Full Content\n\n`;
    output += `> This file contains the complete content of all Delta Chat documentation pages.\n`;
    output += `> For a condensed overview, see /llms.txt\n\n`;
    output += `---\n\n`;

    for (const doc of docs) {
        const rawContent = await getRawDoc(doc.slug, 'en');
        if (rawContent) {
            const title = doc.meta?.title || doc.slug;
            output += `## ${title}\n`;
            output += `URL: https://deltachat.wiki/en/docs/${doc.slug}\n\n`;
            // Strip frontmatter
            const content = rawContent.replace(/^---[\s\S]*?---\n*/m, '');
            output += content.trim();
            output += `\n\n---\n\n`;
        }
    }

    return new Response(output, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'max-age=3600'
        }
    });
};
