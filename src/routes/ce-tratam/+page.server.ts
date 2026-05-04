import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { problemsQuery, type ProblemCard } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let cms: ProblemCard[] = [];
	try {
		cms = await sanity.fetch<ProblemCard[]>(problemsQuery);
	} catch (e) {
		console.warn('[sanity] problems fetch failed, using static fallback:', e);
	}
	return { cms };
};
