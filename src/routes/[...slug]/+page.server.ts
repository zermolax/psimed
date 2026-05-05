import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { pageBySlugQuery, allPageSlugsQuery, type GenericPage } from '$lib/queries';

// Enumerăm slug-urile la build time pentru prerender static.
// Dacă Sanity e indisponibil, returnam [] — build-ul reușește,
// pur și simplu nu se prerendează pagini generice.
export const entries: EntryGenerator = async () => {
	try {
		const slugs = await sanity.fetch<Array<{ slug: string }>>(allPageSlugsQuery);
		return slugs.map((s) => ({ slug: s.slug }));
	} catch (e) {
		console.warn('[sanity] failed to fetch page slugs for prerender:', e);
		return [];
	}
};

export const load: PageServerLoad = async ({ params }) => {
	let page: GenericPage = null;
	try {
		page = await sanity.fetch<GenericPage>(pageBySlugQuery, { slug: params.slug });
	} catch (e) {
		console.warn(`[sanity] page fetch failed for slug "${params.slug}":`, e);
	}

	if (!page) {
		error(404, { message: 'Pagina nu a fost găsită' });
	}

	return { page };
};
