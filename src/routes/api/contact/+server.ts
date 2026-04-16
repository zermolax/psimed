import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, phone, subject, message } = await request.json();

	if (!name || !message) {
		return json({ success: false, error: 'Câmpuri obligatorii lipsă' }, { status: 400 });
	}

	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error('[Contact] RESEND_API_KEY not set');
		return json({ success: false, error: 'Configurare server incompletă' }, { status: 500 });
	}

	const resend = new Resend(apiKey);

	try {
		await resend.emails.send({
			from: 'Formular Contact <noreply@clinicasfgherasim.ro>',
			to: 'office@clinicasfgherasim.ro',
			replyTo: email || undefined,
			subject: subject ? `[Contact] ${subject}` : `[Contact] Mesaj de la ${name}`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: #dd4444; padding: 20px 24px; border-radius: 8px 8px 0 0;">
						<h1 style="color: white; margin: 0; font-size: 20px;">Mesaj nou prin formularul de contact</h1>
					</div>
					<div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
						<table style="width: 100%; border-collapse: collapse;">
							<tr>
								<td style="padding: 8px 0; color: #666; width: 120px; vertical-align: top;"><strong>Nume:</strong></td>
								<td style="padding: 8px 0; color: #111;">${name}</td>
							</tr>
							${email ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Email:</strong></td>
								<td style="padding: 8px 0; color: #111;"><a href="mailto:${email}" style="color: #dd4444;">${email}</a></td>
							</tr>` : ''}
							${phone ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Telefon:</strong></td>
								<td style="padding: 8px 0; color: #111;"><a href="tel:${phone}" style="color: #dd4444;">${phone}</a></td>
							</tr>` : ''}
							${subject ? `<tr>
								<td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Subiect:</strong></td>
								<td style="padding: 8px 0; color: #111;">${subject}</td>
							</tr>` : ''}
						</table>
						<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
						<p style="color: #666; margin: 0 0 8px 0;"><strong>Mesaj:</strong></p>
						<p style="color: #111; margin: 0; white-space: pre-wrap;">${message}</p>
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
