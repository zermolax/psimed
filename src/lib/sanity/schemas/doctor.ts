import { defineType, defineField } from 'sanity';
import { CATEGORY_LIST_OPTIONS } from '../categories';

export const doctor = defineType({
	name: 'doctor',
	title: 'Doctor / Specialist',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Nume complet',
			description: 'Ex: Dr. Maria Popescu, Psih. Andrei Stan',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			description: 'Generat automat din nume. Folosit pentru link-uri stabile.',
			type: 'slug',
			options: {
				source: 'name',
				maxLength: 96
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'photo',
			title: 'Fotografie',
			description: 'Opțional. Dacă lipsește, se afișează un avatar generat automat.',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'title',
			title: 'Titulatură',
			description: 'Ex: Medic Primar Psihiatru, Psiholog Clinician Principal',
			type: 'string',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'category',
			title: 'Categorie',
			description: 'Determină culoarea badge-ului și sortarea pe pagina /specialisti.',
			type: 'string',
			options: {
				list: CATEGORY_LIST_OPTIONS,
				layout: 'radio'
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'specialties',
			title: 'Specialități',
			description: 'Etichete afișate pe card. Primele 3 apar; restul sunt sumarizate.',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (Rule) => Rule.required().min(1)
		}),
		defineField({
			name: 'description',
			title: 'Descriere scurtă',
			description: 'Apare pe card-ul din /specialisti (~2 linii vizibile).',
			type: 'text',
			rows: 4,
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'education',
			title: 'Educație',
			description: 'Listă de diplome / formări. Opțional.',
			type: 'array',
			of: [{ type: 'string' }]
		}),
		defineField({
			name: 'experience',
			title: 'Experiență',
			description: 'Ex: "15+ ani". Opțional.',
			type: 'string'
		}),
		defineField({
			name: 'medsoftDoctorId',
			title: 'ID Medsoft (pentru programări)',
			description:
				'ID-ul doctorului în sistemul Medsoft. Dacă e completat, butonul "Programează" pre-selectează acest doctor. Dacă e gol, butonul duce la /programare generic.',
			type: 'string'
		}),
		defineField({
			name: 'order',
			title: 'Ordine afișare',
			description:
				'Numere mai mici apar primele. Folosit pentru sortare manuală în pagina /specialisti.',
			type: 'number',
			initialValue: 100
		})
	],
	orderings: [
		{
			title: 'Ordine afișare',
			name: 'orderAsc',
			by: [
				{ field: 'order', direction: 'asc' },
				{ field: 'name', direction: 'asc' }
			]
		}
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'title',
			media: 'photo'
		}
	}
});
