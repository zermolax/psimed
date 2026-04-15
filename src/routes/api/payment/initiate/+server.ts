import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createEncryptedOrder } from '$lib/server/services/netopia.service';
import { medsoft } from '$lib/server/services/medsoft.service';
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
			patientPrenume,
			doctorName,
			locationName,
			displayDate,
			displayTime
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

		// ── Pre-validation: check the slot is still available in MedSoft ──
		// Re-fetch the schedule right before payment to catch slots that were
		// booked by another patient between the time the calendar loaded and now.
		const slotDate = startDateTime.split(' ')[0]; // "YYYY-MM-DD"
		const schedule = await medsoft.getDoctorSchedule(
			doctorId,
			slotDate,
			slotDate
		);

		// Parse the requested start/end as timestamps for comparison
		const reqStart = new Date(startDateTime.replace(' ', 'T')).getTime();
		const reqEnd = new Date(endDateTime.replace(' ', 'T')).getTime();

		// The slot is valid if ANY IsAvailable=1 block fully contains [reqStart, reqEnd]
		const slotAvailable = schedule.some((s) => {
			if (Number(s.IsAvailable) !== 1) return false;
			const blockStart = new Date(s.StartDateTime).getTime();
			const blockEnd = new Date(s.EndDateTime).getTime();
			return blockStart <= reqStart && reqEnd <= blockEnd;
		});

		if (!slotAvailable) {
			console.log('[Payment] Slot no longer available:', { doctorId, startDateTime, endDateTime });
			return json(
				{
					success: false,
					error: 'Ora selectată nu mai este disponibilă. Vă rugăm selectați altă oră.'
				},
				{ status: 409 }
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

		// Summary for the /confirmare page (passed via return URL — no DB needed)
		const summary = {
			name: patientName,
			email: patientEmail || null,
			phone: patientPhoneNumber,
			doctor: doctorName || null,
			location: locationName || null,
			date: displayDate || null,
			time: displayTime || null,
			service: appointmentDetails || 'Consultație',
			amount
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
			returnUrl: `${appUrl}/confirmare?orderId=${orderId}`
		});

		return json({ success: true, env_key, data, payment_url, orderId, summary });
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
