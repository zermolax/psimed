import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { policyPageQuery, type PolicyPage } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let cms: PolicyPage = null;
	try {
		cms = await sanity.fetch<PolicyPage>(policyPageQuery, { key: 'livrare' });
	} catch (e) {
		console.warn('[sanity] policyPage(livrare) failed:', e);
	}
	return { cms };
};
