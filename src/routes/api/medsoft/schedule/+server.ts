import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft, type ScheduleSlot } from '$lib/server/services/medsoft.service';
import { env } from '$env/dynamic/private';

// Normalize MedSoft datetime strings to the clinic's local timezone.
//
// MedSoft returns times in Romanian local time but marks them as UTC, e.g.:
//   "2026-03-10T08:00:00.000+0000"  ← colon-less ISO 8601 basic format
//   "2026-03-11T08:00:00Z"          ← Z suffix (seen in some API versions)
//
// Browsers parse +0000 / Z as UTC, so 08:00+0000 → 10:00 Romanian time (2h offset).
//
// Fix: normalise to extended ISO format (+HH:MM), then replace any UTC/zero offset
// with the configured local offset (+02:00 EET winter, +03:00 EEST summer).
// Set MEDSOFT_TZ_OFFSET in Vercel environment variables.
function normalizeDateTime(dt: string, offset: string): string {
	// Step 1: convert colon-less offset (+0000, +0200) → colon format (+00:00, +02:00)
	const normalized = dt.replace(/([+-])(\d{2})(\d{2})$/, '$1$2:$3');

	// Step 2: if it already carries a non-UTC offset (e.g. "+02:00") → correct as-is
	if (normalized.match(/[+-]\d{2}:\d{2}$/) && !normalized.endsWith('+00:00')) {
		return normalized;
	}

	// Step 3: strip Z or +00:00, then append the configured local offset
	const base = normalized.replace(/Z$/, '').replace(/\+00:00$/, '');
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

		// Diagnostic: log first 3 raw slots so Vercel function logs show actual IsAvailable values
		if (schedule.length > 0) {
			console.log('[MedSoft] Sample raw slots:', JSON.stringify(schedule.slice(0, 3)));
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
