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
	try {
		const formData = await request.formData();
		const envKey = formData.get('env_key') as string;
		const data = formData.get('data') as string;

		if (!envKey || !data) {
			console.error('Netopia IPN: missing env_key or data');
			return xmlText(buildIpnResponse('1', '1', 'Missing payment data'));
		}

		// Decrypt the IPN payload
		xml = decryptIpnCallback(envKey, data);
		console.log('Netopia IPN received, action:', getXmlValue(xml, 'action'));

		const action = getXmlValue(xml, 'action');
		const errorCode = getXmlAttr(xml, 'error', 'code') || getXmlValue(xml, 'error');

		// Handle non-approved actions (cancel, error, credit)
		if (CANCEL_ACTIONS.includes(action)) {
			console.log(`Netopia IPN: payment ${action}`);
			return xmlText(buildIpnResponse('0', '0', action));
		}

		if (!APPROVED_ACTIONS.includes(action)) {
			console.log(`Netopia IPN: unknown action ${action}`);
			return xmlText(buildIpnResponse('0', '0', 'acknowledged'));
		}

		// Payment approved — read booking data from params
		const bookingB64 = getParamValue(xml, 'd');
		if (!bookingB64) {
			console.error('Netopia IPN: missing booking param "d"');
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
		} catch {
			console.error('Netopia IPN: failed to parse booking payload');
			return xmlText(buildIpnResponse('1', '99', 'Invalid booking data'));
		}

		// Create the appointment in MedSoft
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

		console.log('MedSoft appointment created:', result);

		// Respond to Netopia with success
		return xmlText(buildIpnResponse('0', '0', 'confirmed'));
	} catch (error) {
		console.error('Netopia IPN processing error:', error, '\nXML:', xml);
		// Return error type 1 (general error) — Netopia will retry
		return xmlText(buildIpnResponse('1', '1', 'Server error'));
	}
};
