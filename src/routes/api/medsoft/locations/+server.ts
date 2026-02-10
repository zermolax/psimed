import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async () => {
	try {
		const locations = await medsoft.getClinicLocations();
		return json({ success: true, data: locations });
	} catch (error) {
		console.error('Error fetching clinic locations:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
