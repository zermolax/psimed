import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import {
	aboutPageQuery,
	doctorsQuery,
	type AboutPage,
	type Doctor
} from '$lib/queries';
import { CATEGORY_CONFIG } from '$lib/sanity/categories';

type SpecialistCard = {
	id: string;
	name: string;
	title: string;
	specialties: string[];
	description: string;
	category: Doctor['category'];
	image?: string;
};

export const load: PageServerLoad = async () => {
	let about: AboutPage = null;
	let specialists: SpecialistCard[] = [];

	try {
		about = await sanity.fetch<AboutPage>(aboutPageQuery);
	} catch (e) {
		console.warn('[sanity] aboutPage fetch failed:', e);
	}

	try {
		const fromSanity = await sanity.fetch<Doctor[]>(doctorsQuery);
		if (fromSanity?.length) {
			specialists = fromSanity.map((d) => ({
				id: d.medsoftDoctorId || d.id,
				name: d.name,
				title: d.title,
				specialties: d.specialties,
				description: d.description,
				category: d.category,
				image: d.image
			}));
		}
	} catch (e) {
		console.warn('[sanity] doctors fetch failed, falling back to static:', e);
	}

	if (specialists.length === 0) {
		const { specialists: staticList } = await import('$lib/data/specialists');
		specialists = staticList.map((s) => ({
			id: s.id,
			name: s.name,
			title: s.title,
			specialties: s.specialties,
			description: s.description,
			category: s.category,
			image: s.image
		}));
	}

	specialists.sort((a, b) => {
		const aOrder = CATEGORY_CONFIG[a.category]?.order ?? 999;
		const bOrder = CATEGORY_CONFIG[b.category]?.order ?? 999;
		return aOrder - bOrder;
	});

	return { about, specialists };
};
