import adapter from '@sveltejs/adapter-auto';
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
		adapter: adapter(),
		prerender: {
			// Don't crawl - we have dynamic pages with actions that can't be prerendered
			crawl: false,
			// Only prerender the static homepage and other static pages
			entries: ['/', '/servicii', '/tratamente', '/despre-noi', '/contact']
		}
	}
};

export default config;
