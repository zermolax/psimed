import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft, type ScheduleSlot } from '$lib/server/services/medsoft.service';

/**
 * Get the UTC offset string for Europe/Bucharest at a specific date.
 * Uses the runtime's IANA timezone database via Intl — automatically handles DST.
 *
 * Romania uses:
 *   EET  (UTC+02:00) — last Sunday of October → last Sunday of March
 *   EEST (UTC+03:00) — last Sunday of March  → last Sunday of October
 */
function getRomaniaOffset(naiveDateTimeStr: string): string {
	// Treat the naive datetime as UTC to create a reference Date for offset lookup.
	// DST switches at 03:00 local (≈ 01:00 UTC) and appointments are during
	// business hours (08:00–18:00), so the lookup is always unambiguous.
	const refDate = new Date(naiveDateTimeStr + 'Z');

	try {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone: 'Europe/Bucharest',
			timeZoneName: 'longOffset'
		}).formatToParts(refDate);

		const tz = parts.find((p) => p.type === 'timeZoneName');
		if (tz) {
			const m = tz.value.match(/GMT([+-]\d{2}:\d{2})/);
			if (m) return m[1];
		}
	} catch {
		// timeZoneName:'longOffset' unsupported — shouldn't happen on Node 18+
	}
	return '+02:00'; // safe fallback (EET)
}

/**
 * Normalize MedSoft datetime strings to the correct Romania timezone.
 *
 * MedSoft returns times in Romanian local time but stamps them as UTC:
 *   "2026-04-17T08:00:00.000+0000"  → actually 08:00 Romanian time
 *   "2026-04-17T08:00:00Z"          → actually 08:00 Romanian time
 *
 * Fix: strip the bogus UTC marker, compute the correct Romania offset
 * for that specific date (handling DST automatically), and re-attach it.
 * No env vars needed — the offset is derived from the IANA timezone database.
 */
function normalizeDateTime(dt: string): string {
	// Step 1: convert colon-less offset (+0000, +0200) → colon format (+00:00, +02:00)
	const normalized = dt.replace(/([+-])(\d{2})(\d{2})$/, '$1$2:$3');

	// Step 2: if it already carries a non-UTC offset (e.g. "+03:00") → trust it
	if (normalized.match(/[+-]\d{2}:\d{2}$/) && !normalized.endsWith('+00:00')) {
		return normalized;
	}

	// Step 3: strip Z or +00:00 to get bare local datetime
	const bare = normalized.replace(/Z$/, '').replace(/\+00:00$/, '');

	// Step 4: compute the correct Romania offset for this specific date
	const offset = getRomaniaOffset(bare);
	return bare + offset;
}

function normalizeDateTimes(slots: ScheduleSlot[]): ScheduleSlot[] {
	return slots.map((s) => ({
		...s,
		StartDateTime: normalizeDateTime(s.StartDateTime),
		EndDateTime: normalizeDateTime(s.EndDateTime)
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

		// Diagnostic: log ALL slots so we can verify if MedSoft splits blocks around manual bookings
		console.log(`[MedSoft] Schedule: ${schedule.length} blocks returned`);
		schedule.forEach((s, i) => {
			console.log(`[MedSoft] Block ${i}: ${s.StartDateTime} → ${s.EndDateTime} | IsAvailable=${s.IsAvailable} | DoctorId=${s.DoctorId}`);
		});

		return json({ success: true, data: normalizeDateTimes(schedule) });
	} catch (error) {
		console.error('Error fetching schedule:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Eroare la conectare' },
			{ status: 500 }
		);
	}
};
