/**
 * Import afecțiuni (problems) din src/lib/data/problems.ts în Sanity.
 *
 * Rulează local cu un token cu permisiuni de scriere (Editor):
 *   SANITY_API_WRITE_TOKEN=skXXX npx tsx scripts/import-problems.ts
 *
 * Idempotent: re-rularea actualizează documentele existente (matched by slug).
 * Tokenul NU se stochează — folosit doar pe durata scriptului.
 */

import { createClient } from '@sanity/client';
import { problems } from '../src/lib/data/problems';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'iz2dbpse';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2026-05-03';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
	console.error(
		'\n❌ Missing SANITY_API_WRITE_TOKEN env var.\n' +
			'   Generate at sanity.io/manage → API → Tokens (Editor permissions).\n' +
			'   Run: SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/import-problems.ts\n'
	);
	process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function importProblems() {
	console.log(`\n📦 Importez ${problems.length} afecțiuni în Sanity (${dataset})...\n`);

	const tx = client.transaction();

	for (const p of problems) {
		const docId = `problem-${p.slug}`;
		tx.createOrReplace({
			_id: docId,
			_type: 'problem',
			title: p.title,
			slug: { _type: 'slug', current: p.slug },
			subtitle: p.subtitle,
			category: p.category,
			icon: p.icon,
			shortDescription: p.shortDescription,
			heroDescription: p.heroDescription,
			symptoms: p.symptoms,
			whenToSeekHelp: p.whenToSeekHelp,
			treatments: p.treatments.map((t, i) => ({
				_key: `treatment-${i}`,
				name: t.name,
				description: t.description
			})),
			specialists: p.specialists,
			relatedProblems: p.relatedProblems.map((r, i) => ({
				_key: `related-${i}`,
				title: r.title,
				href: r.href
			})),
			specialtyParam: p.specialtyParam,
			order: 100
		});
	}

	await tx.commit();
	console.log(`✅ Import complet: ${problems.length} documente create/actualizate.\n`);
}

importProblems().catch((err) => {
	console.error('❌ Import eșuat:', err);
	process.exit(1);
});
