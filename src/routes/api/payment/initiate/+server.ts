import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createEncryptedOrder } from '$lib/server/services/netopia.service';
import { PUBLIC_APP_URL } from '$env/static/public';

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
			appointmentNotes,
			amount,
			patientNume,
			patientPrenume
		} = body;

		// Validate required fields
		if (
			!doctorId ||
			!locationId ||
			!startDateTime ||
			!endDateTime ||
			!patientName ||
			!patientPhoneNumber ||
			!amount ||
			amount <= 0
		) {
			return json(
				{ success: false, error: 'Câmpuri obligatorii lipsă sau prețul este 0' },
				{ status: 400 }
			);
		}

		// Generate a short unique order ID (alphanumeric, safe for Netopia)
		const orderId = crypto.randomUUID().replace(/-/g, '').substring(0, 20);

		// The booking payload will be echoed back by Netopia in the IPN <params>
		const bookingPayload = {
			doctorId,
			locationId,
			startDateTime,
			endDateTime,
			patientName,
			patientEmail: patientEmail || null,
			patientPhoneNumber,
			appointmentDetails: appointmentDetails || 'Consultație',
			appointmentNotes: appointmentNotes || null
		};

		const appUrl = PUBLIC_APP_URL || 'https://www.clinicasfgherasim.ro';

		const { env_key, data, payment_url } = await createEncryptedOrder({
			orderId,
			amount,
			currency: 'RON',
			details: appointmentDetails || 'Consultație medicală',
			patientNume: patientNume || patientName.split(' ').slice(0, -1).join(' ') || patientName,
			patientPrenume: patientPrenume || patientName.split(' ').pop() || '',
			patientEmail: patientEmail || '',
			patientTelefon: patientPhoneNumber,
			bookingPayload,
			confirmUrl: `${appUrl}/api/payment/callback`,
			returnUrl: `${appUrl}/confirmare`
		});

		return json({ success: true, env_key, data, payment_url });
	} catch (error) {
		console.error('Payment initiation error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Eroare la inițializarea plății'
			},
			{ status: 500 }
		);
	}
};
