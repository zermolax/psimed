import { defineType, defineField } from 'sanity';

export const promotion = defineType({
	name: 'promotion',
	title: 'Promoție / Campanie',
	type: 'document',
	groups: [
		{ name: 'content', title: 'Conținut', default: true },
		{ name: 'meta', title: 'Meta & SEO' }
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu campanie',
			description: 'Folosit ca H1 pe pagină. Ex: "Suport parental și speranță"',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			description:
				'Calea URL după /promotii/. Ex: "suport-parental-speranta". Trebuie unic per limbă.',
			type: 'slug',
			group: 'content',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'locale',
			title: 'Limbă',
			type: 'string',
			group: 'content',
			options: {
				list: [
					{ title: '🇷🇴 Română', value: 'ro' },
					{ title: '🇬🇧 English', value: 'en' },
					{ title: '🇮🇹 Italiano', value: 'it' }
				],
				layout: 'radio'
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'campaignKey',
			title: 'Cheie campanie (leagă traducerile)',
			description:
				'Aceeași valoare pentru toate variantele lingvistice ale aceleiași campanii. Ex: "suport-parental-speranta" pentru ro/en/it. Folosit la language switcher.',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitlu / Lead',
			description: 'Apare sub titlu, pe pagina campaniei. Scurt, 1-2 propoziții.',
			type: 'text',
			rows: 2,
			group: 'content'
		}),
		defineField({
			name: 'cover',
			title: 'Imagine cover',
			description: 'Apare pe card-ul din /promotii și opțional la începutul campaniei.',
			type: 'image',
			options: { hotspot: true },
			group: 'content'
		}),
		defineField({
			name: 'excerpt',
			title: 'Rezumat (card index)',
			description: 'Text scurt afișat pe card-ul din lista de campanii.',
			type: 'text',
			rows: 3,
			group: 'content'
		}),
		defineField({
			name: 'intro',
			title: 'Introducere (paragraf hero)',
			description: 'Primul paragraf al campaniei, care urmează după titlu.',
			type: 'array',
			group: 'content',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Paragraf', value: 'normal' }],
					lists: [],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						],
						annotations: []
					}
				}
			]
		}),
		defineField({
			name: 'bullets',
			title: 'Puncte cheie (cu icon)',
			description: 'Listă de beneficii / argumente. Apare ca lista cu icon-uri.',
			type: 'array',
			group: 'content',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'iconName',
							title: 'Nume icon',
							description: 'Ex: heart, brain, check, user, calendar',
							type: 'string'
						}),
						defineField({
							name: 'label',
							title: 'Etichetă (bold)',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'description',
							title: 'Descriere',
							description: 'Textul după etichetă. Suportă inline bold/italic.',
							type: 'text',
							rows: 2
						})
					],
					preview: { select: { title: 'label', subtitle: 'iconName' } }
				}
			]
		}),
		defineField({
			name: 'closing',
			title: 'Închidere (paragraf înainte de CTA)',
			description: 'Opțional. Paragraf de închidere înainte de call-to-action.',
			type: 'array',
			group: 'content',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Paragraf', value: 'normal' }],
					lists: [],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						],
						annotations: []
					}
				}
			]
		}),
		defineField({
			name: 'ctaText',
			title: 'Text buton CTA',
			type: 'string',
			group: 'content',
			initialValue: 'Programează o evaluare'
		}),
		defineField({
			name: 'ctaSubtext',
			title: 'Text adițional sub CTA',
			description: 'Opțional. Ex: "Sună la +40 376 501 501 pentru programare"',
			type: 'string',
			group: 'content'
		}),
		defineField({
			name: 'ctaHref',
			title: 'Link CTA',
			description: 'Default: /programare',
			type: 'string',
			group: 'content',
			initialValue: '/programare'
		}),
		defineField({
			name: 'hashtags',
			title: 'Hashtag-uri',
			description: 'Pentru distribuire pe rețele sociale. Fără #, doar cuvântul.',
			type: 'array',
			group: 'content',
			of: [{ type: 'string' }]
		}),
		defineField({
			name: 'disclaimer',
			title: 'Disclaimer (jos)',
			description: 'Text legal/etic medical, opțional.',
			type: 'array',
			group: 'content',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Paragraf', value: 'normal' }],
					lists: [],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						],
						annotations: []
					}
				}
			]
		}),
		defineField({
			name: 'publishedAt',
			title: 'Data publicării',
			description: 'Campania apare doar dacă această dată e setată și e ≤ acum.',
			type: 'datetime',
			group: 'meta',
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'expiresAt',
			title: 'Data expirării (opțional)',
			description: 'Dacă setată, campania nu mai apare după acest moment.',
			type: 'datetime',
			group: 'meta'
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO — Titlu',
			description: 'Dacă lipsește, se folosește titlul campaniei.',
			type: 'string',
			group: 'meta'
		}),
		defineField({
			name: 'seoDescription',
			title: 'SEO — Descriere',
			type: 'text',
			rows: 3,
			group: 'meta'
		}),
		defineField({
			name: 'seoKeywords',
			title: 'SEO — Cuvinte cheie',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'meta'
		})
	],
	orderings: [
		{
			title: 'Cele mai noi întâi',
			name: 'publishedDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }]
		}
	],
	preview: {
		select: { title: 'title', subtitle: 'locale', media: 'cover' },
		prepare({ title, subtitle, media }) {
			const flag = subtitle === 'ro' ? '🇷🇴' : subtitle === 'en' ? '🇬🇧' : subtitle === 'it' ? '🇮🇹' : '';
			return { title, subtitle: `${flag} ${subtitle?.toUpperCase() ?? ''}`, media };
		}
	}
});
