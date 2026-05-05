import { defineType, defineField } from 'sanity';

export const page = defineType({
	name: 'page',
	title: 'Pagină generică',
	description:
		'Pagini noi create de echipa clinicii (ex: oferte, parteneri, evenimente). URL-ul = /<slug>.',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titlu pagină',
			description: 'Folosit ca H1 dacă nu setezi un titlu hero diferit.',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			description:
				'Calea URL după domeniu. Ex: "oferte-speciale" → /oferte-speciale. Evită cuvinte rezervate (contact, specialisti, programare, ce-tratam, despre-noi, etc.) — rutele existente au prioritate.',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'heroTitle',
			title: 'Titlu hero (opțional)',
			description: 'Dacă e completat, înlocuiește "Titlu pagină" în antet. Util pentru titluri mai expresive.',
			type: 'string'
		}),
		defineField({
			name: 'heroLead',
			title: 'Paragraf introductiv (sub titlu)',
			description: 'Text scurt afișat sub titlu, înainte de conținutul principal.',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'body',
			title: 'Conținut principal',
			description: 'Conținutul paginii. Suportă titluri H2/H3, paragrafe, liste, link-uri.',
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
								fields: [
									{ name: 'href', type: 'url', title: 'URL' }
								]
							}
						]
					}
				}
			]
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO — Titlu pagină (browser tab + Google)',
			description: 'Dacă lipsește, se folosește titlul paginii. Recomandat 50-60 caractere.',
			type: 'string'
		}),
		defineField({
			name: 'seoDescription',
			title: 'SEO — Descriere (Google snippet)',
			description: 'Recomandat 150-160 caractere.',
			type: 'text',
			rows: 3
		})
	],
	preview: {
		select: { title: 'title', subtitle: 'slug.current' },
		prepare({ title, subtitle }) {
			return { title, subtitle: subtitle ? `/${subtitle}` : '(fără slug)' };
		}
	}
});
