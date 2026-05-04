import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Setări site',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu site',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'phone',
			title: 'Telefon contact',
			type: 'string'
		}),
		defineField({
			name: 'email',
			title: 'Email contact',
			type: 'string',
			validation: (Rule) => Rule.email()
		}),
		defineField({
			name: 'address',
			title: 'Adresă',
			type: 'text',
			rows: 2
		})
	]
});
