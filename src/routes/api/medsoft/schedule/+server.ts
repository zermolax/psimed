import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async ({ url }) => {
	const locationId = url.searchParams.get('locationId');
	const doctorId = url.searchParams.get('doctorId');
	const dateStart = url.searchParams.get('dateStart');
	const dateEnd = url.searchParams.get('dateEnd');

	if (!dateStart || !dateEnd) {
		return json({ success: false, error: 'dateStart and dateEnd are required' }, { status: 400 });
	}

	try {
		let schedule;

		if (doctorId) {
			// Get schedule for specific doctor
			schedule = await medsoft.getDoctorSchedule(parseInt(doctorId), dateStart, dateEnd);
		} else if (locationId) {
			// Get schedule for entire location
			schedule = await medsoft.getLocationSchedule(parseInt(locationId), dateStart, dateEnd);
		} else {
			return json(
				{ success: false, error: 'Either locationId or doctorId is required' },
				{ status: 400 }
			);
		}

		return json({ success: true, data: schedule });
	} catch (error) {
		console.error('Error fetching schedule:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
