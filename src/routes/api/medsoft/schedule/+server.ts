import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft, type ScheduleSlot } from '$lib/server/services/medsoft.service';
import { env } from '$env/dynamic/private';

// Normalize MedSoft datetime strings to the clinic's local timezone.
//
// MedSoft returns times in Romanian local time but appends 'Z' (e.g. "2026-03-11T08:00:00Z").
// 'Z' means UTC, so browsers interpret 08:00Z as 08:00 UTC = 10:00 Romanian time → 2h offset.
//
// Fix: strip 'Z' / '+00:00' and replace with the configured local offset (+02:00 EET winter,
// +03:00 EEST summer). Set MEDSOFT_TZ_OFFSET in Vercel environment variables.
function normalizeDateTime(dt: string, offset: string): string {
	// Already has a non-UTC timezone offset (e.g. "+02:00") → correct as-is
	if (dt.match(/[+-]\d{2}:\d{2}$/) && !dt.endsWith('+00:00')) {
		return dt;
	}
	// Strip 'Z' or '+00:00' suffix, then append the configured local offset
	const base = dt.replace(/Z$/, '').replace(/\+00:00$/, '');
	return base + offset;
}

function normalizeDateTimes(slots: ScheduleSlot[]): ScheduleSlot[] {
	const offset = env.MEDSOFT_TZ_OFFSET ?? '+02:00';
	return slots.map((s) => ({
		...s,
		StartDateTime: normalizeDateTime(s.StartDateTime, offset),
		EndDateTime: normalizeDateTime(s.EndDateTime, offset)
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
