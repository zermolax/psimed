import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Singleton document for the /despre-noi page.
 *
 * Each top-level field maps 1:1 to a visual section of the page.
 * Editors fill predefined slots; layout and styling stay in code so
 * the page can never look "broken".
 *
 * Sections (in render order):
 *  1. hero          → big title + lead paragraph
 *  2. stats         → 4 stat cards (e.g. "15+ Ani de experiență")
 *  3. story         → "Povestea Noastră" with prose + optional pull-quote
 *  4. missionVision → side-by-side Mission / Vision text
 *  5. values        → grid of value cards (icon + title + description)
 *  6. whyChooseUs   → grid of feature cards
 *
 * The two CTA sections at the bottom of the page are intentionally NOT
 * editable — they link to fixed routes (/specialisti, /programare) and
 * are template-level concerns, not content.
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

const COLOR_OPTIONS = [
	{ title: 'Roșu (primary)', value: 'primary' },
	{ title: 'Albastru (secondary)', value: 'secondary' },
	{ title: 'Galben (accent)', value: 'accent' },
	{ title: 'Verde (nature)', value: 'nature' }
];

export const aboutPage = defineType({
	name: 'aboutPage',
	title: 'Despre noi (pagină)',
	type: 'document',
	groups: [
		{ name: 'hero', title: '1. Hero (titlul mare)' },
		{ name: 'stats', title: '2. Statistici (4 numere)' },
		{ name: 'story', title: '3. Povestea Noastră' },
		{ name: 'missionVision', title: '4. Misiune & Viziune' },
		{ name: 'values', title: '5. Valorile Noastre' },
		{ name: 'whyChooseUs', title: '6. De Ce Noi' }
	],
	fields: [
		// --- 1. HERO -----------------------------------------------------
		defineField({
			name: 'heroTitle',
			title: 'Titlu principal',
			description:
				'Apare ca H1 mare. Poți marca o porțiune cu culoare (vezi câmpul următor).',
			type: 'string',
			group: 'hero',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'heroTitleAccent',
			title: 'Cuvânt accentuat (opțional)',
			description:
				'Dacă completat, această porțiune din titlu apare colorată. Ex: titlu="Despre Clinica Sf. Gherasim", accent="Clinica Sf. Gherasim" → apare colorat doar numele.',
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

		// --- 2. STATS ----------------------------------------------------
		defineField({
			name: 'stats',
			title: 'Statistici (recomandat 4)',
			description:
				'Apar pe banda neagră de sub hero. Numerele apar mari în culoare, etichetele dedesubt.',
			type: 'array',
			group: 'stats',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'statItem',
					fields: [
						defineField({
							name: 'value',
							title: 'Valoare',
							description: 'Ex: "15+", "5000+", "95%"',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'label',
							title: 'Etichetă',
							description: 'Ex: "Ani de experiență", "Pacienți ajutați"',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'color',
							title: 'Culoare',
							type: 'string',
							options: { list: COLOR_OPTIONS, layout: 'radio' },
							initialValue: 'primary'
						})
					],
					preview: {
						select: { title: 'value', subtitle: 'label' }
					}
				})
			],
			validation: (Rule) => Rule.max(4)
		}),

		// --- 3. STORY ----------------------------------------------------
		defineField({
			name: 'storyEyebrow',
			title: 'Eyebrow (text mic deasupra titlului)',
			description: 'Ex: "Povestea Noastră". Apare cu litere mici colorate.',
			type: 'string',
			group: 'story',
			initialValue: 'Povestea Noastră'
		}),
		defineField({
			name: 'storyTitle',
			title: 'Titlu secțiune',
			type: 'string',
			group: 'story'
		}),
		defineField({
			name: 'storyBody',
			title: 'Conținut (rich text)',
			description: 'Mai multe paragrafe, suport pentru bold, italic, link-uri.',
			type: 'array',
			group: 'story',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Paragraf', value: 'normal' }],
					lists: [],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						]
					}
				}
			]
		}),
		defineField({
			name: 'storyQuoteText',
			title: 'Citat (opțional)',
			description:
				'Textul citatului afișat pe cardul roșu din dreapta. Lasă gol dacă nu vrei card de citat.',
			type: 'text',
			rows: 3,
			group: 'story'
		}),
		defineField({
			name: 'storyQuoteAttribution',
			title: 'Atribuire citat',
			description: 'Cine a spus citatul. Ex: "Filosofia Clinicii Sf. Gherasim"',
			type: 'string',
			group: 'story'
		}),

		// --- 4. MISSION & VISION ----------------------------------------
		defineField({
			name: 'missionVisionEyebrow',
			title: 'Eyebrow',
			type: 'string',
			group: 'missionVision',
			initialValue: 'Misiune & Viziune'
		}),
		defineField({
			name: 'missionVisionTitle',
			title: 'Titlu secțiune',
			type: 'string',
			group: 'missionVision'
		}),
		defineField({
			name: 'missionText',
			title: 'Misiunea Noastră',
			type: 'text',
			rows: 5,
			group: 'missionVision'
		}),
		defineField({
			name: 'visionText',
			title: 'Viziunea Noastră',
			type: 'text',
			rows: 5,
			group: 'missionVision'
		}),

		// --- 5. VALUES --------------------------------------------------
		defineField({
			name: 'valuesEyebrow',
			title: 'Eyebrow',
			type: 'string',
			group: 'values',
			initialValue: 'Valorile Noastre'
		}),
		defineField({
			name: 'valuesTitle',
			title: 'Titlu secțiune',
			type: 'string',
			group: 'values'
		}),
		defineField({
			name: 'values',
			title: 'Valori (recomandat 4)',
			type: 'array',
			group: 'values',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'valueItem',
					fields: [
						defineField({
							name: 'iconName',
							title: 'Icon',
							type: 'string',
							options: { list: ICON_OPTIONS },
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'title',
							title: 'Titlu',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'description',
							title: 'Descriere scurtă',
							type: 'text',
							rows: 2,
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'color',
							title: 'Culoare icon',
							type: 'string',
							options: { list: COLOR_OPTIONS, layout: 'radio' },
							initialValue: 'primary'
						})
					],
					preview: {
						select: { title: 'title', subtitle: 'iconName' }
					}
				})
			]
		}),

		// --- 6. WHY CHOOSE US -------------------------------------------
		defineField({
			name: 'whyChooseUsEyebrow',
			title: 'Eyebrow',
			type: 'string',
			group: 'whyChooseUs',
			initialValue: 'De Ce Noi'
		}),
		defineField({
			name: 'whyChooseUsTitle',
			title: 'Titlu secțiune',
			type: 'string',
			group: 'whyChooseUs'
		}),
		defineField({
			name: 'whyChooseUsItems',
			title: 'Argumente (recomandat 6)',
			type: 'array',
			group: 'whyChooseUs',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'whyItem',
					fields: [
						defineField({
							name: 'iconName',
							title: 'Icon',
							type: 'string',
							options: { list: ICON_OPTIONS },
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'title',
							title: 'Titlu',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'description',
							title: 'Descriere',
							type: 'text',
							rows: 2,
							validation: (Rule) => Rule.required()
						})
					],
					preview: {
						select: { title: 'title', subtitle: 'iconName' }
					}
				})
			]
		})
	],
	preview: {
		select: { title: 'heroTitle' },
		prepare: ({ title }) => ({ title: title || 'Despre noi' })
	}
});
