import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { blogPostsQuery, type BlogPostCard } from '$lib/queries';

export const load: PageServerLoad = async () => {
	let posts: BlogPostCard[] = [];
	try {
		posts = await sanity.fetch<BlogPostCard[]>(blogPostsQuery);
	} catch (e) {
		console.warn('[sanity] blog posts fetch failed:', e);
	}
	return { posts };
};
