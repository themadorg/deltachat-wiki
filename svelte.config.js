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
