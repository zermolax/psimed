import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async ({ url }) => {
	const locationId = url.searchParams.get('locationId');

	if (!locationId) {
		return json({ success: false, error: 'locationId is required' }, { status: 400 });
	}

	try {
		const specialties = await medsoft.getLocationSpecialties(parseInt(locationId));
		return json({ success: true, data: specialties });
	} catch (error) {
		console.error('Error fetching specialties:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
