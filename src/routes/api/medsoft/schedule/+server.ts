import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft, type ScheduleSlot } from '$lib/server/services/medsoft.service';
import { env } from '$env/dynamic/private';

// Append a timezone offset to datetime strings that lack one.
// MedSoft may return times in local Romanian time without a TZ marker (e.g. "2026-03-09T10:00:00").
// Without this, browsers may interpret them as local time, which can cause display offsets.
// Adjust MEDSOFT_TZ_OFFSET in Vercel env vars (+02:00 EET, +03:00 EEST, +00:00 UTC) to match
// whatever timezone MedSoft uses internally until schedule times align with the MedSoft backend.
function normalizeDateTimes(slots: ScheduleSlot[]): ScheduleSlot[] {
	const offset = env.MEDSOFT_TZ_OFFSET ?? '+02:00';
	return slots.map((s) => ({
		...s,
		StartDateTime:
			s.StartDateTime.includes('+') || s.StartDateTime.endsWith('Z')
				? s.StartDateTime
				: s.StartDateTime + offset,
		EndDateTime:
			s.EndDateTime.includes('+') || s.EndDateTime.endsWith('Z')
				? s.EndDateTime
				: s.EndDateTime + offset
	}));
}

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

		return json({ success: true, data: normalizeDateTimes(schedule) });
	} catch (error) {
		console.error('Error fetching schedule:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
