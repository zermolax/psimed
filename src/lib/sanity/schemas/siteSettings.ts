import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Setări site',
	type: 'document',
	groups: [
		{ name: 'general', title: 'General', default: true },
		{ name: 'navigation', title: 'Meniu navigație' }
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu site',
			type: 'string',
			group: 'general',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'phone',
			title: 'Telefon contact',
			type: 'string',
			group: 'general'
		}),
		defineField({
			name: 'email',
			title: 'Email contact',
			type: 'string',
			group: 'general',
			validation: (Rule) => Rule.email()
		}),
		defineField({
			name: 'address',
			title: 'Adresă',
			type: 'text',
			rows: 2,
			group: 'general'
		}),
		defineField({
			name: 'navigation',
			title: 'Meniu navigație (header)',
			description:
				'Dacă lași gol, se folosește meniul implicit din cod. Dacă adaugi cel puțin un item, înlocuiește complet meniul implicit.',
			type: 'array',
			group: 'navigation',
			of: [
				{
					type: 'object',
					title: 'Item meniu',
					fields: [
						defineField({
							name: 'label',
							title: 'Etichetă afișată',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'href',
							title: 'Link',
							description: 'URL relativ (ex: /blog, /oferte) sau absolut (https://...).',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'children',
							title: 'Submeniu (dropdown, opțional)',
							description:
								'Dacă adaugi item-uri aici, se afișează ca dropdown la hover/tap.',
							type: 'array',
							of: [
								{
									type: 'object',
									fields: [
										defineField({
											name: 'label',
											title: 'Etichetă',
											type: 'string',
											validation: (Rule) => Rule.required()
										}),
										defineField({
											name: 'href',
											title: 'Link',
											description: 'Lasă gol dacă e doar titlu de secțiune.',
											type: 'string'
										}),
										defineField({
											name: 'isHeading',
											title: 'Este titlu de secțiune (fără link)',
											description:
												'Bifează pentru a afișa text îngroșat fără link, ca separator în dropdown.',
											type: 'boolean',
											initialValue: false
										})
									],
									preview: {
										select: { title: 'label', subtitle: 'href' }
									}
								}
							]
						})
					],
					preview: {
						select: { title: 'label', subtitle: 'href' }
					}
				}
			]
		})
	]
});
