import { type Handle, redirect } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import * as mimetypes from 'mime-types';
import { supportedLangCodes, supportedLanguages } from '$lib/i18n.svelte';

export const handle: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url;
    const supportedLangs = supportedLangCodes as unknown as string[];

    // Check if the URL already starts with a supported language
    const langMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const urlLang = langMatch ? langMatch[1] : null;
    const hasLang = urlLang && supportedLangs.includes(urlLang);

    // Get language from URL, cookie, header, or default to 'fa'
    const lang = urlLang || event.cookies.get('lang') || event.request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'fa';
    const finalLang = supportedLangs.includes(lang) ? lang : 'fa';
    const finalDir = supportedLanguages.find(l => l.code === finalLang)?.dir || 'ltr';

    // Skip redirects for static files, API routes, and special paths
    if (!hasLang && !pathname.startsWith('/debug') && !pathname.startsWith('/_') && !pathname.includes('.') && pathname !== '/') {
        throw redirect(307, `/${finalLang}${pathname}`);
    }

    event.locals.lang = hasLang ? urlLang : finalLang;

    // Intercept image requests in docs
    if (pathname.includes('/images/') && /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(pathname)) {
        const match = pathname.match(/^\/[a-z]{2}\/(docs\/)?(.*)$/);
        if (match) {
            const pageLang = pathname.split('/')[1];
            const relativePath = match[2];
            const fullPath = path.join(process.cwd(), 'src/docs', pageLang, relativePath);

            if (fs.existsSync(fullPath)) {
                const fileBuffer = fs.readFileSync(fullPath);
                const mimeType = mimetypes.lookup(fullPath) || 'application/octet-stream';
                return new Response(fileBuffer, {
                    headers: {
                        'Content-Type': mimeType,
                        'Cache-Control': 'public, max-age=3600'
                    }
                });
            }
        }
    }

    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('%lang%', event.locals.lang).replace('%dir%', event.locals.lang === 'fa' ? 'rtl' : 'ltr')
    });
};
