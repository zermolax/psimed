import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
	name: 'blogPost',
	title: 'Articol blog',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu articol',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			description: 'Generat automat din titlu. Calea va fi /blog/<slug>.',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'cover',
			title: 'Imagine cover',
			description: 'Apare pe card-ul din /blog și la începutul articolului.',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'excerpt',
			title: 'Rezumat (card + SEO)',
			description: 'Text scurt (1-3 propoziții) afișat pe lista de articole.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.max(280)
		}),
		defineField({
			name: 'author',
			title: 'Autor',
			description: 'Selectează un doctor existent. Opțional.',
			type: 'reference',
			to: [{ type: 'doctor' }]
		}),
		defineField({
			name: 'publishedAt',
			title: 'Data publicării',
			description:
				'Articolul apare pe site doar dacă această dată e setată și e ≤ acum. Util pentru programare.',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Conținut articol',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Paragraf', value: 'normal' },
						{ title: 'Titlu mare (H2)', value: 'h2' },
						{ title: 'Subtitlu (H3)', value: 'h3' }
					],
					lists: [
						{ title: 'Listă cu puncte', value: 'bullet' },
						{ title: 'Listă numerotată', value: 'number' }
					],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [{ name: 'href', type: 'url', title: 'URL' }]
							}
						]
					}
				},
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({
							name: 'alt',
							title: 'Text alternativ (SEO)',
							type: 'string'
						})
					]
				}
			]
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO — Titlu (browser tab + Google)',
			description: 'Dacă lipsește, se folosește titlul articolului.',
			type: 'string'
		}),
		defineField({
			name: 'seoDescription',
			title: 'SEO — Descriere (Google snippet)',
			description: 'Dacă lipsește, se folosește rezumatul.',
			type: 'text',
			rows: 3
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
		select: { title: 'title', subtitle: 'publishedAt', media: 'cover' },
		prepare({ title, subtitle, media }) {
			return {
				title,
				subtitle: subtitle ? new Date(subtitle).toLocaleDateString('ro-RO') : '(nepublicat)',
				media
			};
		}
	}
});
