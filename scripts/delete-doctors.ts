/**
 * Delete all 'doctor' documents from Sanity.
 *
 * Use when seed data needs to be cleaned out before manual re-entry in Studio.
 *
 * Run locally with a write token (Editor permissions):
 *   SANITY_API_WRITE_TOKEN=skXXX npx tsx scripts/delete-doctors.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'iz2dbpse';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2026-05-03';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
	console.error(
		'\n❌ Missing SANITY_API_WRITE_TOKEN env var.\n' +
			'   Generate at sanity.io/manage → API → Tokens (Editor permissions).\n' +
			'   Run: SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/delete-doctors.ts\n'
	);
	process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function run() {
	console.log(`\n→ Fetching all doctor documents...`);
	const docs = await client.fetch<{ _id: string; name: string }[]>(
		`*[_type == "doctor"]{ _id, name }`
	);

	if (docs.length === 0) {
		console.log('   (no doctor documents found — nothing to delete)\n');
		return;
	}

	console.log(`   Found ${docs.length} doctor(s):\n`);
	for (const d of docs) {
		console.log(`     - ${d.name}  (${d._id})`);
	}
	console.log();

	const tx = client.transaction();
	for (const d of docs) {
		// Delete both the published doc and any associated draft.
		tx.delete(d._id);
		tx.delete(`drafts.${d._id.replace(/^drafts\./, '')}`);
	}

	const result = await tx.commit({ visibility: 'async' });
	console.log(`✅ Deleted ${docs.length} document(s) (drafts also cleared).\n`);
	console.log(`   Transaction id: ${result.transactionId}\n`);
}

run().catch((err) => {
	console.error('\n❌ Delete failed:', err.message);
	process.exit(1);
});
