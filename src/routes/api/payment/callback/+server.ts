import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decryptIpnCallback, buildIpnResponse } from '$lib/server/services/netopia.service';
import { medsoft } from '$lib/server/services/medsoft.service';

// ─── In-memory payment status store ──────────────────────────────────────────
// Both GET (status poll) and POST (IPN callback) live in the same file so
// Vercel bundles them into one serverless function that shares this Map.
const STATUS_TTL = 5 * 60 * 1000; // 5 minutes
const paymentResults = new Map<string, { status: 'confirmed' | 'failed'; ts: number }>();

function setPaymentStatus(orderId: string, status: 'confirmed' | 'failed') {
	paymentResults.set(orderId, { status, ts: Date.now() });
	// Lazy cleanup
	if (paymentResults.size > 50) {
		const now = Date.now();
		for (const [k, v] of paymentResults) {
			if (now - v.ts > STATUS_TTL) paymentResults.delete(k);
		}
	}
}

function getPaymentStatus(orderId: string): 'confirmed' | 'failed' | 'pending' {
	const entry = paymentResults.get(orderId);
	if (!entry) return 'pending';
	if (Date.now() - entry.ts > STATUS_TTL) {
		paymentResults.delete(orderId);
		return 'pending';
	}
	return entry.status;
}

// ─── GET: polled by /confirmare page to check payment result ─────────────────
export const GET: RequestHandler = async ({ url }) => {
	const orderId = url.searchParams.get('orderId');
	if (!orderId) return json({ status: 'pending' });
	return json({ status: getPaymentStatus(orderId) });
};

// Netopia IPN actions
// 'confirmed' = payment finalized successfully
// 'paid' with errorCode '0' = payment succeeded (alternative to 'confirmed')
// 'paid' with errorCode != '0' = payment FAILED (e.g. 35 = insufficient funds)
// 'paid_pending' = awaiting 3D Secure or bank confirmation
const CONFIRMED_ACTIONS = ['confirmed'];
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

		console.log(`[Netopia IPN] action="${action}", errorCode="${errorCode}"`);

		// Extract orderId for status store
		const orderId = getXmlAttr(xml, 'order', 'id');

		// Handle cancellations
		if (CANCEL_ACTIONS.includes(action)) {
			console.log(`[Netopia IPN] Payment ${action}`);
			if (orderId) setPaymentStatus(orderId, 'failed');
			return xmlText(buildIpnResponse('0', '0', action));
		}

		// 'paid' with non-zero errorCode = payment FAILED (e.g. 35 = insufficient funds)
		if (action === 'paid' && errorCode && errorCode !== '0') {
			console.log(`[Netopia IPN] Payment failed: action=paid, errorCode=${errorCode}`);
			if (orderId) setPaymentStatus(orderId, 'failed');
			return xmlText(buildIpnResponse('0', '0', 'acknowledged'));
		}

		// Only proceed to create appointment for confirmed payments
		// 'confirmed' = definitive success, 'paid' with errorCode='0' = also success
		const isApproved = CONFIRMED_ACTIONS.includes(action) ||
			(action === 'paid' && (!errorCode || errorCode === '0'));

		if (!isApproved) {
			console.log(`[Netopia IPN] Non-approved action: "${action}", errorCode: "${errorCode}"`);
			if (orderId) setPaymentStatus(orderId, 'failed');
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

		// Mark as confirmed in the status store
		if (orderId) setPaymentStatus(orderId, 'confirmed');

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
