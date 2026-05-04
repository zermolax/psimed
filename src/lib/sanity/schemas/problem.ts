import { defineType, defineField } from 'sanity';

export const problem = defineType({
	name: 'problem',
	title: 'Afecțiuni tratate (Ce Tratăm)',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug URL',
			description: 'Generat automat din titlu. Nu modifica după publicare — schimbă URL-ul.',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitlu',
			description: 'Ex: Tulburarea din Spectrul Autist',
			type: 'string'
		}),
		defineField({
			name: 'category',
			title: 'Categorie',
			type: 'string',
			options: {
				list: [
					{ title: '👶 Copii', value: 'copii' },
					{ title: '🧑 Adulți', value: 'adulti' }
				],
				layout: 'radio'
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'icon',
			title: 'Nume icon',
			description: 'Ex: brain, heart, moon, shield. Folosit pe card-ul din /ce-tratam.',
			type: 'string'
		}),
		defineField({
			name: 'shortDescription',
			title: 'Descriere scurtă (card)',
			description: 'Apare pe card-ul din /ce-tratam. Max 2 rânduri vizibile.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'heroDescription',
			title: 'Descriere hero (pagina detaliată)',
			description: 'Paragraf introductiv al paginii /ce-tratam/[slug].',
			type: 'text',
			rows: 6
		}),
		defineField({
			name: 'symptoms',
			title: 'Simptome',
			description: 'Listă de simptome afișate pe pagina detaliată.',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		defineField({
			name: 'whenToSeekHelp',
			title: 'Când să ceri ajutor',
			description: 'Indicații pentru pacient / familie.',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		defineField({
			name: 'treatments',
			title: 'Tratamente disponibile',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'name', title: 'Denumire', type: 'string' }),
						defineField({ name: 'description', title: 'Descriere', type: 'text', rows: 3 })
					],
					preview: { select: { title: 'name' } }
				}
			]
		}),
		defineField({
			name: 'specialists',
			title: 'Specialiști recomandați',
			description: 'Ex: Psihiatru pediatric, Logoped',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		defineField({
			name: 'relatedProblems',
			title: 'Afecțiuni conexe',
			description: 'Linkuri către alte afecțiuni din /ce-tratam.',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', title: 'Titlu afișat', type: 'string' }),
						defineField({
							name: 'href',
							title: 'Link',
							description: 'Ex: /ce-tratam/adhd',
							type: 'string'
						})
					],
					preview: { select: { title: 'title', subtitle: 'href' } }
				}
			]
		}),
		defineField({
			name: 'specialtyParam',
			title: 'Specialitate (param programare)',
			description: 'Valoarea trimisă la /programare pentru pre-selectarea specialității. Ex: psihiatrie-pediatrica',
			type: 'string'
		}),
		defineField({
			name: 'order',
			title: 'Ordine afișare',
			description: 'Numere mai mici apar primele în cadrul categoriei.',
			type: 'number',
			initialValue: 100
		})
	],
	orderings: [
		{
			title: 'Categorie + Ordine',
			name: 'categoryOrder',
			by: [
				{ field: 'category', direction: 'asc' },
				{ field: 'order', direction: 'asc' },
				{ field: 'title', direction: 'asc' }
			]
		}
	],
	preview: {
		select: { title: 'title', subtitle: 'category' },
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: subtitle === 'copii' ? '👶 Copii' : subtitle === 'adulti' ? '🧑 Adulți' : subtitle
			};
		}
	}
});
