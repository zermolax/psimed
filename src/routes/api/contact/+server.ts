import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { rateLimit } from '$lib/server/utils/rateLimit';

const CYRILLIC = /[Ѐ-ӿ]/;
const CJK = /[一-鿿]/;
const URL_RX = /https?:\/\/|www\./gi;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function silentOk(reason: string, ip: string) {
	console.warn(`[Contact] Rejected: ${reason} (ip=${ip})`);
	return json({ success: true });
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();
	const body = await request.json();
	const { name, email, phone, subject, message, website, loadedAt } = body ?? {};

	if (typeof website === 'string' && website.trim().length > 0) {
		return silentOk('honeypot', ip);
	}

	if (typeof loadedAt !== 'number' || Date.now() - loadedAt < 3000) {
		return silentOk('time-trap', ip);
	}

	if (!rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000)) {
		return silentOk('rate-limit', ip);
	}

	if (!name || !message) {
		return json({ success: false, error: 'Câmpuri obligatorii lipsă' }, { status: 400 });
	}

	const nameStr = String(name);
	const messageStr = String(message);
	const subjectStr = subject ? String(subject) : '';
	const emailStr = email ? String(email) : '';

	if (nameStr.length < 2 || nameStr.length > 100) return silentOk('name-length', ip);
	if (messageStr.length < 10 || messageStr.length > 5000) return silentOk('message-length', ip);

	const combined = `${nameStr} ${subjectStr} ${messageStr}`;
	if (CYRILLIC.test(combined) || CJK.test(combined)) return silentOk('content-script', ip);

	const urlCount = (messageStr.match(URL_RX) ?? []).length;
	if (urlCount > 2) return silentOk('too-many-urls', ip);

	if (emailStr && !EMAIL_RX.test(emailStr)) return silentOk('email-format', ip);

	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error('[Contact] RESEND_API_KEY not set');
		return json({ success: false, error: 'Configurare server incompletă' }, { status: 500 });
	}

	const resend = new Resend(apiKey);

	const textBody = [
		`Mesaj nou prin formularul de contact`,
		``,
		`Nume: ${nameStr}`,
		emailStr ? `Email: ${emailStr}` : null,
		phone ? `Telefon: ${phone}` : null,
		subjectStr ? `Subiect: ${subjectStr}` : null,
		``,
		`Mesaj:`,
		messageStr,
		``,
		`--`,
		`Clinica Sf. Gherasim · Str. Bogdan Voievod 18, Bacău`
	]
		.filter(Boolean)
		.join('\n');

	try {
		await resend.emails.send({
			from: 'Formular Contact <noreply@clinicasfgherasim.ro>',
			to: 'office@clinicasfgherasim.ro',
			replyTo: emailStr || undefined,
			subject: subjectStr ? `[Contact] ${subjectStr}` : `[Contact] Mesaj de la ${nameStr}`,
			text: textBody,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: #dd4444; padding: 20px 24px; border-radius: 8px 8px 0 0;">
						<h1 style="color: white; margin: 0; font-size: 20px;">Mesaj nou prin formularul de contact</h1>
					</div>
					<div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
						<table style="width: 100%; border-collapse: collapse;">
							<tr>
								<td style="padding: 8px 0; color: #666; width: 120px; vertical-align: top;"><strong>Nume:</strong></td>
								<td style="padding: 8px 0; color: #111;">${nameStr}</td>
							</tr>
							${emailStr ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Email:</strong></td>
								<td style="padding: 8px 0; color: #111;"><a href="mailto:${emailStr}" style="color: #dd4444;">${emailStr}</a></td>
							</tr>` : ''}
							${phone ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Telefon:</strong></td>
								<td style="padding: 8px 0; color: #111;"><a href="tel:${phone}" style="color: #dd4444;">${phone}</a></td>
							</tr>` : ''}
							${subjectStr ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Subiect:</strong></td>
								<td style="padding: 8px 0; color: #111;">${subjectStr}</td>
							</tr>` : ''}
						</table>
						<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
						<p style="color: #666; margin: 0 0 8px 0;"><strong>Mesaj:</strong></p>
						<p style="color: #111; margin: 0; white-space: pre-wrap;">${messageStr}</p>
					</div>
					<p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 16px;">
						Clinica Sf. Gherasim · Str. Bogdan Voievod 18, Bacău
					</p>
				</div>
			`
		});

		return json({ success: true });
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('[Contact] Resend error:', msg);
		return json({ success: false, error: 'Eroare la trimiterea mesajului' }, { status: 500 });
	}
};
