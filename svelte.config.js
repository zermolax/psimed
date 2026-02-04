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
			// Only prerender static pages (programare uses MedSoft API so not prerendered)
			entries: [
				'/',
				'/servicii',
				'/tratamente',
				'/tratamente/neurofeedback',
				'/tratamente/hipnoza-clinica',
				'/despre-noi',
				'/contact',
				'/evaluari-psihologice'
			],
			// Ignore routes that weren't found during build
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
