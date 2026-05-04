import { sanity } from '$lib/server/sanity';
import { siteSettingsQuery, type SiteSettings } from '$lib/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	let siteSettings: SiteSettings = null;
	try {
		siteSettings = await sanity.fetch<SiteSettings>(siteSettingsQuery);
	} catch (e) {
		console.warn('[sanity] siteSettings fetch failed, using fallback:', e);
	}
	return { siteSettings };
};
