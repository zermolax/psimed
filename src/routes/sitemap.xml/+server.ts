import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	const baseUrl = 'https://www.clinicasfgherasim.ro';

	const pages = [
		{ loc: '/', priority: '1.0', changefreq: 'weekly' },
		{ loc: '/ce-tratam', priority: '0.9', changefreq: 'monthly' },
		{ loc: '/specialisti', priority: '0.9', changefreq: 'monthly' },
		{ loc: '/servicii-si-preturi', priority: '0.9', changefreq: 'monthly' },
		{ loc: '/despre-noi', priority: '0.7', changefreq: 'monthly' },
		{ loc: '/contact', priority: '0.8', changefreq: 'monthly' },
		{ loc: '/programare', priority: '0.8', changefreq: 'weekly' },
		{ loc: '/politica-confidentialitate', priority: '0.3', changefreq: 'yearly' },
		{ loc: '/termeni-si-conditii', priority: '0.3', changefreq: 'yearly' },
		{ loc: '/politica-de-livrare', priority: '0.3', changefreq: 'yearly' },
		{ loc: '/politica-de-anulare', priority: '0.3', changefreq: 'yearly' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
