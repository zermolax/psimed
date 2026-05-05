import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { blogPostBySlugQuery, allBlogPostSlugsQuery, type BlogPostFull } from '$lib/queries';

export const entries: EntryGenerator = async () => {
	try {
		const slugs = await sanity.fetch<Array<{ slug: string }>>(allBlogPostSlugsQuery);
		return slugs.map((s) => ({ slug: s.slug }));
	} catch (e) {
		console.warn('[sanity] failed to fetch blog post slugs for prerender:', e);
		return [];
	}
};

export const load: PageServerLoad = async ({ params }) => {
	let post: BlogPostFull = null;
	try {
		post = await sanity.fetch<BlogPostFull>(blogPostBySlugQuery, { slug: params.slug });
	} catch (e) {
		console.warn(`[sanity] blog post fetch failed for "${params.slug}":`, e);
	}

	if (!post) {
		error(404, { message: 'Articol negăsit' });
	}

	return { post };
};
