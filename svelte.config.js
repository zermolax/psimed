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
			// Catch-all /[...slug] is prerenderable but may have 0 entries (no pages
			// in Sanity yet) and no internal links. Don't fail the build in that case.
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
