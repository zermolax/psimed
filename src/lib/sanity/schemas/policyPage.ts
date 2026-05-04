import { defineType, defineField } from 'sanity';

export const POLICY_KEYS = [
	{ title: 'Politica de Confidențialitate', value: 'confidentialitate' },
	{ title: 'Politica de Anulare', value: 'anulare' },
	{ title: 'Politica de Livrare', value: 'livrare' },
	{ title: 'Termeni și Condiții', value: 'termeni' }
] as const;

export const policyPage = defineType({
	name: 'policyPage',
	title: 'Pagină legală (policy)',
	type: 'document',
	fields: [
		defineField({
			name: 'key',
			title: 'Identificator pagină',
			description:
				'Determină pe care rută apare conținutul. Fiecare key se folosește o singură dată.',
			type: 'string',
			options: {
				list: [...POLICY_KEYS],
				layout: 'radio'
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'title',
			title: 'Titlu pagină',
			description: 'Apare ca H1 în partea de sus a paginii.',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Conținut',
			description: 'Editor de text bogat. Suportă headings, liste, bold, link-uri.',
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
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [
									{
										name: 'href',
										type: 'url',
										title: 'URL',
										validation: (Rule) =>
											Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] })
									}
								]
							}
						]
					}
				}
			],
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'lastUpdated',
			title: 'Ultima actualizare',
			description: 'Apare la baza paginii. Dacă lipsește, se folosește data publish-ului.',
			type: 'date'
		})
	],
	preview: {
		select: { title: 'title', subtitle: 'key' }
	}
});
