/**
 * Display-only formatting helpers.
 *
 * These never mutate source data — they only adjust how values pulled from
 * external systems (e.g. MedSoft) are shown on the site.
 */

/**
 * Title-case a person's name for display.
 *
 * MedSoft stores names in UPPERCASE ("TUDOR ALEXANDRA-ADRIANA") and its API
 * title-cases them on the way out, but mishandles hyphens — producing
 * "Tudor Alexandra-adriana" (lowercase letter after "-"). This normalises
 * the casing properly: the first letter after the start, a space, a hyphen
 * or an apostrophe is upper-cased; the rest is lower-cased.
 *
 *   "TUDOR ALEXANDRA-ADRIANA"   -> "Tudor Alexandra-Adriana"
 *   "Tudor Alexandra-adriana"   -> "Tudor Alexandra-Adriana"
 *   "STOT-BORNESCU STEFANIA"     -> "Stot-Bornescu Stefania"
 *
 * Uses \p{L} so Romanian diacritics (ă, â, î, ș, ț) are handled correctly.
 */
export function formatPersonName(name: string | null | undefined): string {
	if (!name) return '';
	return name
		.toLocaleLowerCase('ro-RO')
		.replace(/(^|[\s\-'])(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase('ro-RO'));
}
