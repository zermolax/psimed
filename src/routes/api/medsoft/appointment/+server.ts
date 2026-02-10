import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const {
			doctorId,
			locationId,
			startDateTime,
			endDateTime,
			patientName,
			patientEmail,
			patientPhoneNumber,
			appointmentDetails,
			appointmentNotes
		} = body;

		// Validate required fields
		if (!doctorId || !locationId || !startDateTime || !endDateTime || !patientName || !patientPhoneNumber) {
			return json(
				{
					success: false,
					error: 'Lipsesc câmpuri obligatorii: doctorId, locationId, startDateTime, endDateTime, patientName, patientPhoneNumber'
				},
				{ status: 400 }
			);
		}

		// Create appointment via MedSoft API
		const result = await medsoft.createAppointment({
			doctorId,
			locationId,
			startDateTime,
			endDateTime,
			patientName,
			patientEmail,
			patientPhoneNumber,
			patientAddress: null,
			appointmentDetails,
			appointmentNotes
		});

		return json({
			success: true,
			data: result,
			message: 'Programarea a fost creată cu succes!'
		});
	} catch (error) {
		console.error('Error creating appointment:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Eroare la crearea programării'
			},
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const appointmentId = url.searchParams.get('id');

	if (!appointmentId) {
		return json({ success: false, error: 'appointmentId is required' }, { status: 400 });
	}

	try {
		const status = await medsoft.getAppointmentStatus(parseInt(appointmentId));
		return json({ success: true, data: status });
	} catch (error) {
		console.error('Error fetching appointment status:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
