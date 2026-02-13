export interface Specialist {
	id: string;
	name: string;
	title: string;
	specialties: string[];
	description: string;
	image?: string;
	category: 'psihiatru' | 'psiholog' | 'terapeut' | 'alt-specialist';
	education?: string[];
	experience?: string;
}

export const specialists: Specialist[] = [
	{
		id: 'dr-popescu',
		name: 'Dr. Maria Popescu',
		title: 'Medic Primar Psihiatru',
		specialties: ['Psihiatrie Adulți', 'Tulburări Afective', 'Anxietate'],
		description:
			'Cu peste 15 ani de experiență în psihiatrie, Dr. Popescu este specializată în diagnosticul și tratamentul tulburărilor de dispoziție și anxietate. Abordarea sa combină tratamentul medicamentos cu tehnici psihoterapeutice.',
		category: 'psihiatru',
		education: ['Medicină - UMF Iași', 'Rezidențiat Psihiatrie - Spitalul Socola'],
		experience: '15+ ani'
	},
	{
		id: 'dr-ionescu',
		name: 'Dr. Alexandru Ionescu',
		title: 'Medic Primar Psihiatru Pediatric',
		specialties: ['Psihiatrie Pediatrică', 'ADHD', 'Autism/TSA'],
		description:
			'Specializat în psihiatria copilului și adolescentului, Dr. Ionescu are o abordare caldă și empatică. Este expert în evaluarea și tratamentul ADHD, tulburărilor din spectrul autist și anxietății la copii.',
		category: 'psihiatru',
		education: ['Medicină - UMF București', 'Supraspecializare Psihiatrie Pediatrică'],
		experience: '12 ani'
	},
	{
		id: 'psih-dumitru',
		name: 'Psih. Elena Dumitru',
		title: 'Psiholog Clinician Principal',
		specialties: ['Evaluări Psihologice', 'Psihoterapie CBT', 'Copii și Adolescenți'],
		description:
			'Psiholog clinician cu experiență vastă în evaluări psihologice complete și psihoterapie cognitiv-comportamentală. Lucrează atât cu copii cât și cu adulți, având rezultate remarcabile în tratarea anxietății și depresiei.',
		category: 'psiholog',
		education: ['Psihologie - Universitatea București', 'Master Psihologie Clinică', 'Formare CBT'],
		experience: '10 ani'
	},
	{
		id: 'psih-stan',
		name: 'Psih. Andrei Stan',
		title: 'Psihoterapeut - Terapie de Cuplu și Familie',
		specialties: ['Terapie Familială', 'Terapie de Cuplu', 'Parenting'],
		description:
			'Specializat în dinamica relațiilor familiale și de cuplu, oferă suport pentru depășirea crizelor relaționale, îmbunătățirea comunicării și dezvoltarea abilităților parentale.',
		category: 'terapeut',
		education: ['Psihologie - Universitatea Iași', 'Formare Terapie Sistemică de Familie'],
		experience: '8 ani'
	},
	{
		id: 'dr-rotaru',
		name: 'Dr. Ioana Rotaru',
		title: 'Medic Specialist Psihiatru',
		specialties: ['Tulburări de Somn', 'Dependențe', 'Stres și Burnout'],
		description:
			'Cu experiență în tratamentul tulburărilor de somn și dependențelor, Dr. Rotaru oferă o abordare integrativă care combină medicația cu tehnici de igienă a somnului și prevenire a recăderilor.',
		category: 'psihiatru',
		education: ['Medicină - UMF Iași', 'Rezidențiat Psihiatrie'],
		experience: '7 ani'
	},
	{
		id: 'log-marin',
		name: 'Logoped Cristina Marin',
		title: 'Logoped - Specialist Tulburări de Limbaj',
		specialties: ['Logopedia', 'Întârzieri Limbaj', 'Dislexie'],
		description:
			'Specialist în evaluarea și terapia tulburărilor de limbaj și comunicare la copii. Experiență în lucrul cu copii cu întârzieri de dezvoltare, dislexie și tulburări din spectrul autist.',
		category: 'alt-specialist',
		education: ['Psihopedagogie Specială', 'Specializare Logopedie'],
		experience: '9 ani'
	}
];

export function getSpecialistById(id: string): Specialist | undefined {
	return specialists.find((s) => s.id === id);
}

export function getSpecialistsByCategory(category: Specialist['category']): Specialist[] {
	return specialists.filter((s) => s.category === category);
}
