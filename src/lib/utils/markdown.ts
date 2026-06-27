import { codeToHtml } from 'shiki';
import { defineMDSveXConfig } from 'mdsvex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function highlighter(code: string, lang: string | null | undefined = 'text') {
    const language = lang || 'text';
    let html;
    try {
        html = await codeToHtml(code, {
            lang: language,
            theme: 'github-dark-dimmed'
        });
    } catch (e) {
        console.warn(`Language ${language} not supported, falling back to text`);
        html = await codeToHtml(code, {
            lang: 'text',
            theme: 'github-dark-dimmed'
        });
    }

    // Safety check for Buffer in browser-like environments (though this runs in Node during build)
    const base64Code = Buffer.from(code).toString('base64');

    return `<div class="code-block-container" data-lang="${lang}">
        <div class="code-block-header">
            <span class="code-lang">${lang}</span>
            <button class="copy-code-btn" data-code="${base64Code}">
                Copy
            </button>
        </div>
        <div class="code-block-content">{@html \`${html
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$')
            .replace(/{/g, '&#123;')
            .replace(/}/g, '&#125;')}\` }</div>
    </div>`;
}

function remarkRewriteRfcLinks() {
    return (tree: any) => {
        const visit = (node: any) => {
            if (node.type === 'link' && typeof node.url === 'string') {
                node.url = node.url.replace(/^(\/rfcs\/[\w.-]+)\.txt$/, '$1');
            }
            if (Array.isArray(node.children)) {
                for (const child of node.children) visit(child);
            }
        };
        visit(tree);
    };
}

export const mdsvexConfig = defineMDSveXConfig({
    extensions: ['.md', '.svx'],
    remarkPlugins: [remarkRewriteRfcLinks],
    highlight: {
        highlighter
    },
    layout: {
        webxdc: path.resolve(__dirname, '../layouts/DocLayout.svelte'),
        FAQ: path.resolve(__dirname, '../layouts/DocLayout.svelte'),
        general: path.resolve(__dirname, '../layouts/DocLayout.svelte'),
        bot: path.resolve(__dirname, '../layouts/DocLayout.svelte'),
        servers: path.resolve(__dirname, '../layouts/DocLayout.svelte'),
        'checklist-info': path.resolve(__dirname, '../layouts/ChecklistInfoLayout.svelte'),
        _: path.resolve(__dirname, '../layouts/DocLayout.svelte')
    }
});
