import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	],

	kit: {
		adapter: adapter({
			runtime: 'nodejs20.x'
		}),
		csrf: {
			// Netopia IPN callback is a cross-origin server-to-server POST (formData)
			// SvelteKit's default CSRF check blocks it with 403 — disable globally.
			// Safe: our frontend uses fetch+JSON, not traditional form POSTs.
			checkOrigin: false
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// netopia-logo.png is intentionally absent — user adds it manually
				// after downloading from Netopia dashboard → Identitate Vizuală.
				// The <img onerror> handler in Footer.svelte hides it when missing.
				if (path === '/netopia-logo.png') return;
				// All other 404s during prerender are real errors — throw.
				throw new Error(message);
			}
		}
	}
};

export default config;
