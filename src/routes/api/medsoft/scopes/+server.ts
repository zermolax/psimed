import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async ({ url }) => {
	const doctorId = url.searchParams.get('doctorId');

	try {
		let scopes;

		if (doctorId) {
			// Get scopes for specific doctor
			scopes = await medsoft.getAppointmentScopesForDoctor(parseInt(doctorId));
		} else {
			// Get all scopes
			scopes = await medsoft.getAppointmentScopes();
		}

		return json({ success: true, data: scopes });
	} catch (error) {
		console.error('Error fetching appointment scopes:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
