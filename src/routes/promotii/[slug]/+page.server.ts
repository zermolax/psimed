import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import {
	promotionBySlugQuery,
	allPromotionSlugsQuery,
	type PromotionFull
} from '$lib/queries';

export const entries: EntryGenerator = async () => {
	try {
		const slugs = await sanity.fetch<Array<{ slug: string }>>(allPromotionSlugsQuery);
		return slugs.map((s) => ({ slug: s.slug }));
	} catch (e) {
		console.warn('[sanity] failed to fetch promotion slugs for prerender:', e);
		return [];
	}
};

export const load: PageServerLoad = async ({ params }) => {
	let promo: PromotionFull = null;
	try {
		promo = await sanity.fetch<PromotionFull>(promotionBySlugQuery, { slug: params.slug });
	} catch (e) {
		console.warn(`[sanity] promotion fetch failed for "${params.slug}":`, e);
	}

	if (!promo) {
		error(404, { message: 'Campania nu a fost găsită sau a expirat' });
	}

	return { promo };
};
