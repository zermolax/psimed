import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { promotionsQuery, type PromotionCard } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let promotions: PromotionCard[] = [];
	try {
		promotions = await sanity.fetch<PromotionCard[]>(promotionsQuery);
	} catch (e) {
		console.warn('[sanity] promotions fetch failed:', e);
	}
	return { promotions };
};
