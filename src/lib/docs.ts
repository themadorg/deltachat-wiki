import { supportedLangCodes } from './i18n.svelte';

export async function fetchDocs(lang: string = 'fa') {
    const allDocFiles = import.meta.glob('/src/docs/**/*.md');
    const iterableDocFiles = Object.entries(allDocFiles);

    const filteredDocs = await Promise.all(
        iterableDocFiles
            .filter(([path]) => path.includes(`/${lang}/`))
            .map(async ([path, resolver]) => {
                const { metadata } = await resolver() as any;
                const parts = path.split('/');
                const langIndex = parts.indexOf(lang);
                const slugParts = parts.slice(langIndex + 1);
                const slug = slugParts.join('/').replace('.md', '');

                return {
                    meta: metadata || { title: slug.split('/').pop() || slug },
                    slug: slug
                };
            })
    );

    return filteredDocs;
}

export async function getSidebar(fullPath: string, lang: string = 'en') {
    const result = await getSidebarWithPath(fullPath, lang);
    return result ? result.config : null;
}

export async function getSidebarWithPath(fullPath: string, lang: string = 'en'): Promise<{ config: any[]; resolvedPath: string } | null> {
    try {
        const configs = import.meta.glob('/src/docs/**/config.ts');
        const parts = fullPath.split('/');

        // Try from most specific to least specific path
        for (let i = parts.length; i > 0; i--) {
            const section = parts.slice(0, i).join('/');
            const path = `/src/docs/${lang}/${section}/config.ts`;
            const enPath = `/src/docs/en/${section}/config.ts`;

            let config: any;
            if (configs[path]) {
                config = await configs[path]();
            } else if (configs[enPath]) {
                config = await configs[enPath]();
            }

            if (config && config.sidebarConfig) {
                return { config: config.sidebarConfig, resolvedPath: section };
            }
        }
    } catch (e) {
        console.error(`Error loading sidebar config for ${fullPath}:`, e);
    }
    return null;
}

export async function getDoc(path: string | undefined, lang: string) {
    if (!path) return null;
    const allDocs = import.meta.glob('/src/docs/**/*.md');

    // Normalize path
    const normalizedPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    const langs = Array.from(new Set([lang, 'en', ...supportedLangCodes])).filter(Boolean);

    for (const l of langs) {
        for (const [key, resolver] of Object.entries(allDocs)) {
            // Use the same logic as fetchDocs to find the correct file
            const parts = key.split('/');
            const langIndex = parts.indexOf(l);
            if (langIndex === -1) continue;

            const slugParts = parts.slice(langIndex + 1);
            const slug = slugParts.join('/').replace('.md', '').toLowerCase();

            if (slug === normalizedPath) {
                try {
                    const doc = await resolver() as any;
                    return {
                        content: doc.default,
                        meta: doc.metadata || {},
                        slug: normalizedPath,
                        lang: l
                    };
                } catch (e) {
                    console.error(`Error loading doc ${key}:`, e);
                }
            }
        }
    }

    return null;
}
export async function getRawDoc(path: string | undefined, lang: string) {
    if (!path) return null;
    const allDocsRaw = import.meta.glob('/src/docs/**/*.md', { query: '?raw', import: 'default' });

    // Normalize path
    const normalizedPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    const langs = Array.from(new Set([lang, 'en', ...supportedLangCodes])).filter(Boolean);

    for (const l of langs) {
        for (const [key, resolver] of Object.entries(allDocsRaw)) {
            const parts = key.split('/');
            const langIndex = parts.indexOf(l);
            if (langIndex === -1) continue;

            const slugParts = parts.slice(langIndex + 1);
            const slug = slugParts.join('/').replace('.md', '').toLowerCase();

            if (slug === normalizedPath) {
                try {
                    const rawContent = await resolver() as string;
                    return rawContent;
                } catch (e) {
                    console.error(`Error loading raw doc ${key}:`, e);
                }
            }
        }
    }
    return null;
}

export async function getPagination(currentPath: string, lang: string = 'en') {
    const sidebarResult = await getSidebarWithPath(currentPath, lang);
    if (!sidebarResult) return null;

    const { config } = sidebarResult;
    const flattened: { title: string; slug: string }[] = [];

    function flatten(items: any[]) {
        for (const item of items) {
            if (item.slug) {
                flattened.push({ title: item.title, slug: item.slug });
            }
            if (item.items) {
                flatten(item.items);
            }
        }
    }

    flatten(config);

    const currentIndex = flattened.findIndex(item => item.slug.toLowerCase() === currentPath.toLowerCase());
    if (currentIndex === -1) return null;

    return {
        prev: currentIndex > 0 ? flattened[currentIndex - 1] : null,
        next: currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null
    };
}
