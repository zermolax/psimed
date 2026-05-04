import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { aboutPageQuery, type AboutPage } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let cms: AboutPage = null;
	try {
		cms = await sanity.fetch<AboutPage>(aboutPageQuery);
	} catch (e) {
		console.warn('[sanity] aboutPage failed:', e);
	}
	return { cms };
};
