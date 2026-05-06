import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Singleton document for the /clinica page (formerly /despre-noi).
 *
 * Slim structure — sections are render-order:
 *  1. hero        → big title + lead
 *  2. story       → eyebrow + title + Portable Text body
 *  3. foundations → mission + vision + principles (all in one cohesive section)
 *
 * The team (doctor list) is composed on the page from the doctor schema
 * — not part of aboutPage.
 */

const ICON_OPTIONS = [
	{ title: 'Inimă', value: 'heart' },
	{ title: 'Creier', value: 'brain' },
	{ title: 'Bifă (check)', value: 'check' },
	{ title: 'Persoană', value: 'user' },
	{ title: 'Calendar', value: 'calendar' },
	{ title: 'Telefon', value: 'phone' },
	{ title: 'Email', value: 'email' }
];

export const aboutPage = defineType({
	name: 'aboutPage',
	title: 'Clinica (pagină Despre noi + Echipă)',
	type: 'document',
	groups: [
		{ name: 'hero', title: '1. Hero (titlul mare)' },
		{ name: 'story', title: '2. Povestea Noastră' },
		{ name: 'foundations', title: '3. Misiune · Viziune · Principii' }
	],
	fields: [
		// --- 1. HERO -----------------------------------------------------
		defineField({
			name: 'heroTitle',
			title: 'Titlu principal',
			description: 'Apare ca H1 mare. Poți marca o porțiune cu culoare (vezi câmpul următor).',
			type: 'string',
			group: 'hero',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'heroTitleAccent',
			title: 'Cuvânt accentuat (opțional)',
			description:
				'Dacă completat, această porțiune din titlu apare colorată. Ex: titlu="Despre Clinica Sf. Gherasim", accent="Sf. Gherasim".',
			type: 'string',
			group: 'hero'
		}),
		defineField({
			name: 'heroLead',
			title: 'Paragraf intro',
			description: 'Text descriptiv sub titlu, ~2-3 propoziții.',
			type: 'text',
			rows: 3,
			group: 'hero'
		}),

		// --- 2. STORY ----------------------------------------------------
		defineField({
			name: 'storyEyebrow',
			title: 'Eyebrow (etichetă mică deasupra)',
			description: 'Ex: "Povestea noastră"',
			type: 'string',
			group: 'story'
		}),
		defineField({
			name: 'storyTitle',
			title: 'Titlu secțiune',
			description: 'Ex: "De ce am pornit la drum"',
			type: 'string',
			group: 'story'
		}),
		defineField({
			name: 'storyBody',
			title: 'Conținut',
			description: 'Narativul clinicii. Suportă paragrafe, bold, italic.',
			type: 'array',
			group: 'story',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [
						{ title: 'Paragraf', value: 'normal' },
						{ title: 'Citat', value: 'blockquote' }
					],
					lists: [],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						],
						annotations: []
					}
				})
			]
		}),

		// --- 3. FOUNDATIONS (Mission + Vision + Principles together) ---
		defineField({
			name: 'foundationsEyebrow',
			title: 'Eyebrow',
			description: 'Ex: "Misiune · Viziune · Principii"',
			type: 'string',
			group: 'foundations',
			initialValue: 'Misiune · Viziune · Principii'
		}),
		defineField({
			name: 'foundationsTitle',
			title: 'Titlu secțiune',
			description: 'Ex: "Ce ne motivează"',
			type: 'string',
			group: 'foundations',
			initialValue: 'Ce ne motivează'
		}),
		defineField({
			name: 'missionText',
			title: 'Misiune',
			description: 'Un paragraf scurt despre misiunea clinicii.',
			type: 'text',
			rows: 4,
			group: 'foundations'
		}),
		defineField({
			name: 'visionText',
			title: 'Viziune',
			description: 'Un paragraf scurt despre viziunea pe termen lung.',
			type: 'text',
			rows: 4,
			group: 'foundations'
		}),
		defineField({
			name: 'principles',
			title: 'Principii',
			description:
				'Listă de principii / valori care ghidează clinica. 3-6 items recomandat.',
			type: 'array',
			group: 'foundations',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'iconName',
							title: 'Icon',
							type: 'string',
							options: { list: ICON_OPTIONS, layout: 'radio' }
						}),
						defineField({
							name: 'title',
							title: 'Titlu principiu',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'description',
							title: 'Descriere',
							type: 'text',
							rows: 3
						})
					],
					preview: { select: { title: 'title', subtitle: 'iconName' } }
				})
			]
		})
	],
	preview: {
		prepare: () => ({ title: 'Clinica — Despre noi + Echipă' })
	}
});
