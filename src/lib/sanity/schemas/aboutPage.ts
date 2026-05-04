import { defineType, defineField } from 'sanity';

/**
 * Singleton document for the /despre-noi page. Studio enforces "max 1
 * instance" via the structureTool config (added later when we customize
 * the desk structure); for now, the editor sees a single document and
 * is unlikely to create duplicates.
 */
export const aboutPage = defineType({
	name: 'aboutPage',
	title: 'Despre noi (pagină)',
	type: 'document',
	fields: [
		defineField({
			name: 'heroTitle',
			title: 'Titlu hero',
			description: 'Apare în partea de sus a paginii ca titlu mare.',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'heroLead',
			title: 'Subtitlu hero',
			description: 'Paragraf scurt sub titlul mare.',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'body',
			title: 'Conținut principal',
			description: 'Editor de text bogat pentru poveste, misiune, valori.',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Paragraf', value: 'normal' },
						{ title: 'Subtitlu (H2)', value: 'h2' },
						{ title: 'Subtitlu mic (H3)', value: 'h3' }
					],
					lists: [
						{ title: 'Listă cu puncte', value: 'bullet' },
						{ title: 'Listă numerotată', value: 'number' }
					],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' }
						]
					}
				},
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Text alternativ (accesibilitate / SEO)'
						}
					]
				}
			]
		})
	],
	preview: {
		select: { title: 'heroTitle' },
		prepare: ({ title }) => ({ title: title || 'Despre noi' })
	}
});
