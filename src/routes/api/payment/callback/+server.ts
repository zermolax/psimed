import type { RequestHandler } from './$types';
import { decryptIpnCallback, buildIpnResponse } from '$lib/server/services/netopia.service';
import { medsoft } from '$lib/server/services/medsoft.service';

// Netopia IPN actions
const APPROVED_ACTIONS = ['confirmed', 'paid_pending'];
const CANCEL_ACTIONS = ['canceled', 'credit'];

function xmlText(response: string): Response {
	return new Response(response, {
		headers: { 'Content-Type': 'text/xml; charset=utf-8' }
	});
}

function getXmlValue(xml: string, tag: string): string {
	const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'));
	return match ? match[1].trim() : '';
}

function getXmlAttr(xml: string, tag: string, attr: string): string {
	const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
	return match ? match[1] : '';
}

function getParamValue(xml: string, name: string): string {
	// Find <param><name>NAME</name><value>VALUE</value></param>
	const paramRegex = /<param>[\s\S]*?<name>\s*([^<]+?)\s*<\/name>[\s\S]*?<value>([\s\S]*?)<\/value>[\s\S]*?<\/param>/gi;
	let match;
	while ((match = paramRegex.exec(xml)) !== null) {
		if (match[1].trim() === name) {
			return match[2].trim();
		}
	}
	return '';
}

export const POST: RequestHandler = async ({ request }) => {
	let xml = '';
	let step = 'init';
	try {
		// Step 1: Parse form data
		step = 'formData';
		const formData = await request.formData();
		const envKey = formData.get('env_key') as string;
		const data = formData.get('data') as string;

		console.log('[Netopia IPN] Received callback, env_key length:', envKey?.length, 'data length:', data?.length);

		if (!envKey || !data) {
			console.error('[Netopia IPN] Missing env_key or data');
			return xmlText(buildIpnResponse('1', '1', 'Missing payment data'));
		}

		// Step 2: Decrypt the IPN payload
		step = 'decrypt';
		xml = decryptIpnCallback(envKey, data);
		console.log('[Netopia IPN] Decrypted OK, action:', getXmlValue(xml, 'action'));

		const action = getXmlValue(xml, 'action');
		const errorCode = getXmlAttr(xml, 'error', 'code') || getXmlValue(xml, 'error');

		// Handle non-approved actions (cancel, error, credit)
		if (CANCEL_ACTIONS.includes(action)) {
			console.log(`[Netopia IPN] Payment ${action}`);
			return xmlText(buildIpnResponse('0', '0', action));
		}

		if (!APPROVED_ACTIONS.includes(action)) {
			console.log(`[Netopia IPN] Non-approved action: "${action}", errorCode: "${errorCode}"`);
			return xmlText(buildIpnResponse('0', '0', 'acknowledged'));
		}

		// Step 3: Payment approved — read booking data from params
		step = 'parseBooking';
		const bookingB64 = getParamValue(xml, 'd');
		if (!bookingB64) {
			console.error('[Netopia IPN] Missing booking param "d" in XML');
			return xmlText(buildIpnResponse('1', '99', 'Missing booking data param'));
		}

		let bookingPayload: {
			doctorId: number;
			locationId: number;
			startDateTime: string;
			endDateTime: string;
			patientName: string;
			patientEmail?: string;
			patientPhoneNumber: string;
			appointmentDetails?: string;
			appointmentNotes?: string;
		};

		try {
			const decoded = Buffer.from(bookingB64, 'base64').toString('utf8');
			bookingPayload = JSON.parse(decoded);
			console.log('[Netopia IPN] Booking payload parsed:', {
				doctorId: bookingPayload.doctorId,
				startDateTime: bookingPayload.startDateTime,
				patientName: bookingPayload.patientName
			});
		} catch (parseErr) {
			console.error('[Netopia IPN] Failed to parse booking payload:', parseErr);
			return xmlText(buildIpnResponse('1', '99', 'Invalid booking data'));
		}

		// Step 4: Create the appointment in MedSoft
		// IMPORTANT: Always confirm to NETOPIA (0,0) even if MedSoft fails.
		// The payment already went through — returning an error would make
		// NETOPIA retry the IPN endlessly while the patient is already charged.
		step = 'medsoft';
		try {
			const result = await medsoft.createAppointment({
				doctorId: bookingPayload.doctorId,
				locationId: bookingPayload.locationId,
				startDateTime: bookingPayload.startDateTime,
				endDateTime: bookingPayload.endDateTime,
				patientName: bookingPayload.patientName,
				patientEmail: bookingPayload.patientEmail || undefined,
				patientPhoneNumber: bookingPayload.patientPhoneNumber,
				patientAddress: null,
				appointmentDetails: bookingPayload.appointmentDetails || 'Consultație',
				appointmentNotes: bookingPayload.appointmentNotes || undefined
			});
			console.log('[Netopia IPN] MedSoft appointment created:', result);
		} catch (medsoftErr) {
			// Log the error but DO NOT fail the IPN — payment is already charged
			const msg = medsoftErr instanceof Error ? medsoftErr.message : String(medsoftErr);
			console.error('[Netopia IPN] MedSoft appointment FAILED (payment still confirmed):', msg);
		}

		// Respond to Netopia with success — payment is acknowledged
		return xmlText(buildIpnResponse('0', '0', 'confirmed'));
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		console.error(`[Netopia IPN] ERROR at step "${step}":`, errMsg);
		if (xml) console.error('[Netopia IPN] Decrypted XML was:', xml.substring(0, 500));
		// Return error type 1 (general error) — Netopia will retry
		return xmlText(buildIpnResponse('1', '1', `Error at ${step}: ${errMsg}`));
	}
};
