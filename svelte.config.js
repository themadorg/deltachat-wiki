import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvexConfig } from './src/lib/utils/markdown.ts';
import { supportedLangCodes } from './src/lib/languages.ts';

const prerenderEntries = [
	'*',
	...supportedLangCodes.map(code => `/${code}`),
	'/sitemap.xml',
	'/llms-full.txt'
];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	],

	kit: {
		// Root-absolute asset URLs (e.g. /_app/...) so client navigations never
		// resolve modules relative to the current page path. Relative paths plus
		// Cloudflare Pages' HTML fallback for missing .js files cascade into
		// nested /.../_app/immutable/.../_app/... URLs and MIME-type crashes.
		paths: {
			relative: false
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			precompress: true,
			strict: false
		}),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: prerenderEntries
		}
	},

	extensions: ['.svelte', '.md', '.svx']
};

export default config;
