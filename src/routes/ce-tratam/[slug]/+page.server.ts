import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { problemBySlugQuery, type ProblemFull } from '$lib/queries';
import { getProblemBySlug } from '$lib/data/problems';

export const load: PageServerLoad = async ({ params }) => {
	let problem: ProblemFull = null;
	try {
		problem = await sanity.fetch<ProblemFull>(problemBySlugQuery, { slug: params.slug });
	} catch (e) {
		console.warn('[sanity] problem fetch failed, trying static fallback:', e);
	}

	// Fallback la datele statice din problems.ts
	if (!problem) {
		const staticProblem = getProblemBySlug(params.slug);
		if (staticProblem) {
			problem = staticProblem;
		}
	}

	if (!problem) {
		error(404, { message: 'Pagina nu a fost găsită' });
	}

	return { problem };
};
