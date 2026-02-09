import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvexConfig } from './src/lib/utils/markdown.ts';

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
			entries: ['*', '/en', '/fa', '/sitemap.xml', '/llms-full.txt']
		}
	},

	extensions: ['.svelte', '.md', '.svx']
};

export default config;
