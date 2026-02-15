import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProblemBySlug } from '$lib/data/problems';

export const load: PageLoad = ({ params }) => {
	const problem = getProblemBySlug(params.slug);

	if (!problem) {
		error(404, {
			message: 'Pagina nu a fost găsită'
		});
	}

	return {
		problem
	};
};
