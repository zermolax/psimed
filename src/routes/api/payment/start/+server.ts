import { json } from '@sveltejs/kit';
import { Netopia } from 'netopia-card';
import { NETOPIA_API_KEY, NETOPIA_SIGNATURE, NETOPIA_SANDBOX } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const {
			appointmentId,
			amount,
			patientFirstName,
			patientLastName,
			patientEmail,
			patientPhone,
			description,
			browserInfo
		} = body;

		if (!appointmentId || !amount || !patientFirstName || !patientLastName || !patientPhone) {
			return json({ error: 'Date incomplete pentru inițierea plății' }, { status: 400 });
		}

		const isSandbox = NETOPIA_SANDBOX !== 'false';
		const appUrl = PUBLIC_APP_URL.replace(/\/$/, '');

		const netopia = new Netopia({
			apiKey: NETOPIA_API_KEY,
			posSignature: NETOPIA_SIGNATURE,
			notifyUrl: `${appUrl}/api/payment/ipn`,
			redirectUrl: `${appUrl}/programare/confirmare?appointmentId=${appointmentId}`,
			sandbox: isSandbox
		});

		// Browser data collected on frontend for 3DS security
		if (browserInfo) {
			const clientIp =
				request.headers.get('x-forwarded-for') ||
				request.headers.get('cf-connecting-ip') ||
				'127.0.0.1';
			netopia.setBrowserData(browserInfo, clientIp.split(',')[0].trim());
		}

		netopia.setOrderData({
			orderID: `APT-${appointmentId}`,
			amount: Number(amount),
			billing: {
				email: patientEmail || `noreply+apt${appointmentId}@psimed.ro`,
				firstName: patientFirstName,
				lastName: patientLastName,
				phone: patientPhone,
				city: 'Bacau',
				country: 642,
				countryName: 'Romania'
			},
			description: description || 'Consultatie medicala',
			currency: 'RON',
			dateTime: new Date().toISOString()
		});

		netopia.setProductsData([
			{
				name: description || 'Consultatie medicala',
				code: `APT-${appointmentId}`,
				category: 'Servicii medicale',
				price: Number(amount),
				vat: 0
			}
		]);

		const response = await netopia.startPayment();

		console.log(
			`[Payment] Started for appointment ${appointmentId}, amount ${amount} RON, sandbox=${isSandbox}`
		);

		return json(response);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Eroare la inițierea plății';
		console.error('[Payment Start] Error:', message);
		return json({ error: message }, { status: 500 });
	}
};
