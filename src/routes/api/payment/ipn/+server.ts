import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.text();
		const data = JSON.parse(body);
		const { order, payment } = data;

		const orderID = order?.orderID ?? 'unknown';
		const ntpID = payment?.ntpID ?? 'unknown';
		const status = payment?.status;
		const amount = payment?.amount;
		const currency = payment?.currency ?? 'RON';

		console.log(`[Payment IPN] orderID=${orderID} | ntpID=${ntpID} | status=${status} | amount=${amount} ${currency}`);

		// status 3 = confirmed/paid
		// status 5 = declined
		// status 6 = expired
		if (status === 3) {
			console.log(`[Payment IPN] CONFIRMED: ${orderID} | ${amount} ${currency}`);
		} else {
			console.log(`[Payment IPN] NOT CONFIRMED: ${orderID} | status=${status}`);
		}

		return json({ errorCode: 0 });
	} catch (err) {
		console.error('[Payment IPN] Parse error:', err);
		return json({ errorCode: 1 }, { status: 400 });
	}
};
