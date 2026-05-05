import type { PageServerLoad } from './$types';
import { sanity } from '$lib/server/sanity';
import { doctorsQuery, problemsQuery, type Doctor, type ProblemCard } from '$lib/queries';
import { specialists } from '$lib/data/specialists';
import { problems as staticProblems } from '$lib/data/problems';

export const load: PageServerLoad = async () => {
	let doctors: Doctor[] = [];
	let problems: ProblemCard[] = [];

	try {
		doctors = await sanity.fetch<Doctor[]>(doctorsQuery);
	} catch (e) {
		console.warn('[sanity] homepage doctors fetch failed:', e);
	}

	try {
		problems = await sanity.fetch<ProblemCard[]>(problemsQuery);
	} catch (e) {
		console.warn('[sanity] homepage problems fetch failed:', e);
	}

	// Fallback la datele statice dacă Sanity e gol/indisponibil.
	if (doctors.length === 0) {
		doctors = specialists.slice(0, 4).map((s) => ({
			id: s.id,
			name: s.name,
			title: s.title,
			category: s.category,
			specialties: s.specialties ?? [],
			description: s.description ?? '',
			image: s.image
		}));
	}

	if (problems.length === 0) {
		problems = staticProblems.map((p) => ({
			slug: p.slug,
			title: p.title,
			subtitle: p.subtitle,
			category: p.category,
			icon: p.icon,
			shortDescription: p.shortDescription
		}));
	}

	// Selectăm 4 doctori (sortați deja prin order asc) și
	// 3 probleme copii + 3 adulți pentru secțiunea Conditions.
	const featuredDoctors = doctors.slice(0, 4);
	const conditionsCopii = problems.filter((p) => p.category === 'copii').slice(0, 3);
	const conditionsAdulti = problems.filter((p) => p.category === 'adulti').slice(0, 3);
	const featuredConditions = [...conditionsCopii, ...conditionsAdulti];

	return {
		featuredDoctors,
		featuredConditions
	};
};
