import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
			// Layout-urile vor fi adăugate mai târziu când creăm fișierele
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		prerender: {
			crawl: true,
			entries: ['*'],
			handleMissingId: 'warn',
			handleUnseenRoutes: 'warn',
			handleHttpError: 'warn'
		}
	}
};

export default config;
