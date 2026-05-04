import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { policyPageQuery, type PolicyPage } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let cms: PolicyPage = null;
	try {
		cms = await sanity.fetch<PolicyPage>(policyPageQuery, { key: 'termeni' });
	} catch (e) {
		console.warn('[sanity] policyPage(termeni) failed:', e);
	}
	return { cms };
};
