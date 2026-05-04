import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { doctorsQuery, type Doctor } from '$lib/queries';
import { CATEGORY_CONFIG } from '$lib/sanity/categories';

type SpecialistCardData = {
	id: string;
	name: string;
	title: string;
	specialties: string[];
	description: string;
	category: Doctor['category'];
	image?: string;
};

export const load: PageServerLoad = async () => {
	let specialists: SpecialistCardData[] = [];
	let source: 'sanity' | 'static' = 'static';

	try {
		const fromSanity = await sanity.fetch<Doctor[]>(doctorsQuery);
		if (fromSanity && fromSanity.length > 0) {
			specialists = fromSanity.map((d) => ({
				// `id` drives the booking link param; prefer Medsoft ID when available
				// so /programare can pre-select the doctor, fall back to slug otherwise.
				id: d.medsoftDoctorId || d.id,
				name: d.name,
				title: d.title,
				specialties: d.specialties,
				description: d.description,
				category: d.category,
				image: d.image
			}));
			source = 'sanity';
		}
	} catch (e) {
		console.warn('[sanity] doctorsQuery failed, falling back to static data:', e);
	}

	if (specialists.length === 0) {
		const { specialists: staticSpecialists } = await import('$lib/data/specialists');
		specialists = staticSpecialists.map((s) => ({
			id: s.id,
			name: s.name,
			title: s.title,
			specialties: s.specialties,
			description: s.description,
			category: s.category,
			image: s.image
		}));
	}

	specialists.sort(
		(a, b) => CATEGORY_CONFIG[a.category].order - CATEGORY_CONFIG[b.category].order
	);

	return { specialists, source };
};
