/**
 * Import doctors from src/lib/data/specialists.ts into Sanity.
 *
 * Run locally with a write token (Editor permissions):
 *   SANITY_API_WRITE_TOKEN=skXXX npx tsx scripts/import-doctors.ts
 *
 * The token is NOT stored anywhere — it's only read from the env var
 * for the duration of this script. Generate one at sanity.io/manage
 * → API → Tokens → Add API Token → Editor permissions, and rotate
 * it after this script finishes.
 *
 * Idempotent: re-running updates existing documents matched by their
 * deterministic `_id` (derived from the source `id` in specialists.ts).
 */

import { createClient } from '@sanity/client';
import { specialists, type Specialist } from '../src/lib/data/specialists';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'iz2dbpse';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2026-05-03';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
	console.error(
		'\n❌ Missing SANITY_API_WRITE_TOKEN env var.\n' +
			'   Generate at sanity.io/manage → API → Tokens (Editor permissions).\n' +
			'   Run: SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/import-doctors.ts\n'
	);
	process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

function toSanityDoc(s: Specialist, index: number) {
	return {
		_id: `doctor.${s.id}`,
		_type: 'doctor',
		name: s.name,
		slug: { _type: 'slug', current: s.id },
		title: s.title,
		category: s.category,
		specialties: s.specialties,
		description: s.description,
		education: s.education ?? [],
		experience: s.experience,
		// Source data has no Medsoft IDs; client populates manually.
		medsoftDoctorId: undefined,
		order: (index + 1) * 10
	};
}

async function run() {
	console.log(`\n→ Importing ${specialists.length} doctors into Sanity...`);
	console.log(`   project: ${projectId}, dataset: ${dataset}\n`);

	const tx = client.transaction();
	for (let i = 0; i < specialists.length; i++) {
		const doc = toSanityDoc(specialists[i], i);
		tx.createOrReplace(doc);
		console.log(`   [${i + 1}/${specialists.length}] ${doc.name}  (id: ${doc._id})`);
	}

	const result = await tx.commit();
	console.log(`\n✅ Committed ${result.results.length} mutations.`);
	console.log('   Open Sanity Studio → "Doctor / Specialist" to verify.\n');
}

run().catch((err) => {
	console.error('\n❌ Import failed:', err.message);
	process.exit(1);
});
