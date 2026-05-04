/**
 * Single source of truth for doctor/specialist categories.
 *
 * Used by:
 * - the doctor schema (Studio dropdown)
 * - SpecialistCard (badge color, border color)
 * - /specialisti +page.server.ts (sort order)
 * - /specialisti +page.svelte (legend)
 *
 * To add a new category: append a key here. Tailwind classes must be
 * referenced as full string literals so the v4 scanner picks them up.
 */

export type DoctorCategory =
	| 'psihiatru'
	| 'psiholog'
	| 'terapeut'
	| 'consilier'
	| 'logoped'
	| 'kinetoterapeut'
	| 'terapeut-ocupational'
	| 'neuropsiholog'
	| 'asistent-medical'
	| 'alt-specialist';

export type CategoryConfig = {
	label: string;
	bgClass: string;
	borderClass: string;
	order: number;
};

export const CATEGORY_CONFIG: Record<DoctorCategory, CategoryConfig> = {
	psihiatru: {
		label: 'Psihiatru',
		bgClass: 'bg-primary',
		borderClass: 'border-l-primary',
		order: 0
	},
	psiholog: {
		label: 'Psiholog',
		bgClass: 'bg-secondary',
		borderClass: 'border-l-secondary',
		order: 1
	},
	terapeut: {
		label: 'Psihoterapeut',
		bgClass: 'bg-accent',
		borderClass: 'border-l-accent',
		order: 2
	},
	consilier: {
		label: 'Consilier psihologic',
		bgClass: 'bg-amber-500',
		borderClass: 'border-l-amber-500',
		order: 3
	},
	neuropsiholog: {
		label: 'Neuropsiholog',
		bgClass: 'bg-violet-600',
		borderClass: 'border-l-violet-600',
		order: 4
	},
	logoped: {
		label: 'Logoped',
		bgClass: 'bg-pink-500',
		borderClass: 'border-l-pink-500',
		order: 5
	},
	kinetoterapeut: {
		label: 'Kinetoterapeut',
		bgClass: 'bg-emerald-600',
		borderClass: 'border-l-emerald-600',
		order: 6
	},
	'terapeut-ocupational': {
		label: 'Terapeut ocupațional',
		bgClass: 'bg-indigo-500',
		borderClass: 'border-l-indigo-500',
		order: 7
	},
	'asistent-medical': {
		label: 'Asistent medical',
		bgClass: 'bg-slate-600',
		borderClass: 'border-l-slate-600',
		order: 8
	},
	'alt-specialist': {
		label: 'Alt specialist',
		bgClass: 'bg-nature',
		borderClass: 'border-l-nature',
		order: 9
	}
};

/**
 * Studio dropdown options derived from CATEGORY_CONFIG so the list and
 * the visual config never drift out of sync.
 */
export const CATEGORY_LIST_OPTIONS = (
	Object.entries(CATEGORY_CONFIG) as [DoctorCategory, CategoryConfig][]
)
	.sort((a, b) => a[1].order - b[1].order)
	.map(([value, cfg]) => ({ title: cfg.label, value }));
