import type { PageServerLoad } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export interface EvaluarePsihologica {
	name: string;
	description: string;
	steps: string[];
	totalTime: string;
	price: number;
}

export const load: PageServerLoad = async () => {
	let priceItems;
	let success = true;

	try {
		// Fetch appointment scopes which contain services and prices
		const scopes = await medsoft.getAppointmentScopes();

		// Transform to a format suitable for the PriceTable component
		const raw = scopes.flatMap((scope) => {
			if (scope.lista_servicii && scope.lista_servicii.length > 0) {
				return scope.lista_servicii.map((service) => ({
					name: service.denumire,
					price: service.pret,
					duration: scope.durata,
					category: categorizeService(scope.scop, service.denumire)
				}));
			}
			return [
				{
					name: scope.scop,
					price: 0,
					duration: scope.durata,
					category: categorizeService(scope.scop, scope.scop)
				}
			];
		});

		// Filter out items without prices and remove duplicates
		priceItems = raw
			.filter((item) => item.price > 0)
			.filter(
				(item, index, self) =>
					index === self.findIndex((t) => t.name === item.name && t.price === item.price)
			);
	} catch (error) {
		console.error('Error fetching prices:', error);
		priceItems = getStaticPrices();
		success = false;
	}

	return {
		priceItems,
		evaluari: getEvaluariPsihologice(),
		success
	};
};

function categorizeService(scopName: string, serviceName: string): string {
	const name = (scopName + ' ' + serviceName).toLowerCase();
	if (name.includes('consult') || name.includes('prima vizită')) return 'Consultații';
	if (name.includes('evaluare') || name.includes('test') || name.includes('psihodiagnostic'))
		return 'Evaluări Psihologice';
	if (name.includes('terapie') || name.includes('psihoterapie') || name.includes('ședință'))
		return 'Psihoterapie';
	if (name.includes('neurofeedback') || name.includes('hipnoză') || name.includes('tratament'))
		return 'Tratamente';
	return 'Alte Servicii';
}

function getStaticPrices() {
	return [
		{ name: 'Consultație Psihiatrică Adulți - Prima Vizită', price: 350, duration: 60, category: 'Consultații' },
		{ name: 'Consultație Psihiatrică Adulți - Control', price: 250, duration: 30, category: 'Consultații' },
		{ name: 'Consultație Psihiatrie Pediatrică - Prima Vizită', price: 350, duration: 60, category: 'Consultații' },
		{ name: 'Consultație Psihiatrie Pediatrică - Control', price: 250, duration: 30, category: 'Consultații' },
		{ name: 'Evaluare Psihologică Anexa 8 (Încadrare handicap / Orientare școlară)', price: 350, duration: 120, category: 'Evaluări Psihologice' },
		{ name: 'Evaluare Psihologică Completă Copii', price: 800, duration: 180, category: 'Evaluări Psihologice' },
		{ name: 'Evaluare Psihologică Completă Adulți', price: 600, duration: 120, category: 'Evaluări Psihologice' },
		{ name: 'Ședință Psihoterapie Individuală', price: 200, duration: 50, category: 'Psihoterapie' },
		{ name: 'Ședință Terapie de Cuplu', price: 300, duration: 90, category: 'Psihoterapie' },
		{ name: 'Ședință Neurofeedback', price: 150, duration: 45, category: 'Tratamente' },
		{ name: 'Ședință Hipnoză Clinică', price: 250, duration: 60, category: 'Tratamente' }
	];
}

function getEvaluariPsihologice(): EvaluarePsihologica[] {
	return [
		{
			name: 'ADOS — Diagnostic Autism',
			description: 'Evaluare standardizată pentru tulburarea din spectrul autist (TSA)',
			steps: [
				'1 h — interviu părinte',
				'1 h — evaluarea copilului',
				'2 h — scorare + eliberare raport',
				'30 min – 1 h — discuție finală'
			],
			totalTime: '5 h',
			price: 675
		},
		{
			name: 'ADI-R — Interviu de Diagnostic Autism',
			description: 'Interviu structurat cu părintele pentru diagnosticul TSA',
			steps: [
				'2 h — aplicare test',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție părinte'
			],
			totalTime: '4 h',
			price: 540
		},
		{
			name: 'Evaluare ADOS + ADI-R',
			description: 'Pachet complet de diagnostic autism (ADOS + ADI-R)',
			steps: [
				'2 h — interviu + aplicare ADI-R',
				'1 h — aplicare ADOS',
				'3 h — scorare + eliberare raport',
				'1 h — discuție părinte'
			],
			totalTime: '7 h',
			price: 1000
		},
		{
			name: 'NEPSY — Formă Scurtă (un singur domeniu)',
			description: 'Evaluare neuropsihologică pe un domeniu: Atenție / Limbaj / Memorie / Motricitate / Percepție socială etc.',
			steps: [
				'1 h — interviu părinte',
				'1 h 30 min — administrare NEPSY',
				'2 h — scorare',
				'30 min — discuție părinte'
			],
			totalTime: '4 h',
			price: 600
		},
		{
			name: 'NEPSY — Formă Extinsă (toate domeniile)',
			description: 'Evaluare neuropsihologică completă pe toate domeniile',
			steps: [
				'1 h — interviu părinte',
				'3 h – 4 h — evaluarea copilului',
				'3 h — scorare + eliberare raport'
			],
			totalTime: '7 h – 8 h',
			price: 1100
		},
		{
			name: 'RAVEN — Coeficient de Inteligență',
			description: 'Evaluarea nivelului de inteligență neverbală',
			steps: [
				'1 h — administrare test',
				'30 min — eliberare raport',
				'30 min — discuție părinte'
			],
			totalTime: '2 h',
			price: 300
		},
		{
			name: 'Scala de Dezvoltare Portage',
			description: 'Evaluarea nivelului de dezvoltare globală a copilului',
			steps: [
				'2 h — interviu + administrare test',
				'1 h — evaluarea copilului',
				'1 h — scorare + eliberare raport',
				'30 min — discuție părinte'
			],
			totalTime: '4 h 30 min',
			price: 600
		},
		{
			name: 'Evaluare ADOS + ADI-R + Portage',
			description: 'Pachet extins autism + nivel de dezvoltare',
			steps: [
				'2 h — interviu + aplicare ADI-R',
				'1 h 30 min — administrare Portage',
				'1 h — aplicare ADOS',
				'3 h 30 min — scorare + eliberare raport',
				'1 h — discuție părinte'
			],
			totalTime: '9 h',
			price: 1300
		},
		{
			name: 'Evaluare ADOS + ADI-R + Raven',
			description: 'Pachet extins autism + coeficient de inteligență',
			steps: [
				'2 h — interviu + aplicare ADI-R',
				'1 h 30 min — administrare Raven',
				'1 h — aplicare ADOS',
				'3 h 30 min — scorare + eliberare raport',
				'1 h — discuție părinte'
			],
			totalTime: '9 h',
			price: 1300
		},
		{
			name: 'Evaluare M-PACI (Preadolescenți 9–12 ani)',
			description: 'Personalitate emergentă și sindroame clinice la preadolescenți',
			steps: [
				'1 h — interviu cu părintele',
				'1 h — administrare test',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție cu părintele'
			],
			totalTime: '4 h',
			price: 540
		},
		{
			name: 'Evaluare MACI (Adolescenți 13–18 ani)',
			description: 'Personalitate, preocupări exprimate și sindroame clinice la adolescenți',
			steps: [
				'1 h — interviu cu părintele',
				'1 h — administrare test',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție cu părintele'
			],
			totalTime: '4 h',
			price: 540
		},
		{
			name: 'Evaluare MCMI (Adulți)',
			description: 'Personalitate, preocupări exprimate și sindroame clinice la adulți',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h 30 min',
			price: 500
		},
		{
			name: 'Evaluare DIVA-5 (Adulți — Diagnostic ADHD)',
			description: 'Evaluare ADHD la adulți conform criteriilor DSM-5',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 450
		},
		{
			name: 'Pachet MCMI + DIVA-5 (Diagnostic diferențial ADHD / Tulburări psihopatologice)',
			description: 'Diferențierea ADHD de tulburările de personalitate și psihopatologice',
			steps: [
				'30 min — interviu inițial',
				'2 h — administrare teste',
				'2 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '5 h',
			price: 700
		},
		{
			name: 'Evaluare ECI-4 (Screening psihiatric preșcolari 3–7 ani)',
			description: 'Screening tulburări psihiatrice la preșcolari',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 400
		},
		{
			name: 'Evaluare CSI-4 (Screening psihiatric 7–12 ani)',
			description: 'Screening tulburări psihiatrice la copii de vârstă școlară',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 400
		},
		{
			name: 'Evaluare ASI-4 (Screening psihiatric 13–18 ani)',
			description: 'Screening tulburări psihiatrice la adolescenți',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 400
		},
		{
			name: 'Evaluare ECI-4 + Evaluare directă a copilului',
			description: 'Screening psihiatric preșcolari (3–7 ani) cu evaluare directă',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare test',
				'1 h — evaluarea copilului',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '4 h 30 min',
			price: 600
		},
		{
			name: 'Evaluare CSI-4 + M-PACI',
			description: 'Screening psihiatric (7–12 ani) + personalitate emergentă',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare screening',
				'1 h — administrare M-PACI',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '4 h 30 min',
			price: 600
		},
		{
			name: 'Evaluare ASI-4 + MACI',
			description: 'Screening psihiatric adolescenți (13–18 ani) + personalitate',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare screening',
				'1 h — administrare MACI',
				'2 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '5 h',
			price: 700
		},
		{
			name: 'Evaluare ECI-4 + Portage + Evaluare directă a copilului',
			description: 'Screening psihiatric preșcolari + nivel de dezvoltare + evaluare directă',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare screening',
				'1 h — administrare Portage',
				'1 h — evaluarea copilului',
				'2 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '6 h',
			price: 800
		},
		{
			name: 'Evaluare CSI-4 + M-PACI + Raven',
			description: 'Screening psihiatric (7–12 ani) + personalitate + inteligență',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare screening',
				'1 h — administrare M-PACI',
				'1 h — Raven',
				'2 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '6 h',
			price: 800
		},
		{
			name: 'Evaluare ASI-4 + MACI + Raven',
			description: 'Screening psihiatric adolescenți + personalitate + inteligență',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare screening',
				'1 h — administrare MACI',
				'1 h — administrare Raven',
				'2 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '6 h 30 min',
			price: 850
		},
		{
			name: 'Evaluare ABAS-II (Comportament Adaptativ, 0–89 ani)',
			description: 'Evaluarea comportamentului adaptativ: social, practic, conceptual. Util în TSA, ADHD, dizabilități intelectuale, orientare școlară.',
			steps: [
				'30 min — discuție inițială',
				'1 h — administrare chestionar',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 400
		},
		{
			name: 'Evaluare ADOS + ADI-R + ABAS-II',
			description: 'Pachet complet autism + comportament adaptativ',
			steps: [
				'2 h — interviu + aplicare ADI-R',
				'1 h — administrare ABAS',
				'1 h — aplicare ADOS',
				'3 h 30 min — scorare + eliberare raport',
				'1 h — discuție părinte'
			],
			totalTime: '8 h 30 min',
			price: 1170
		},
		{
			name: 'NEPSY Formă Scurtă (subteste ADHD) + ABAS-II',
			description: 'Evaluare neuropsihologică ADHD + comportament adaptativ',
			steps: [
				'2 h — interviu părinte',
				'1 h — administrare NEPSY',
				'2 h 30 min — scorare',
				'30 min — discuție părinte'
			],
			totalTime: '6 h',
			price: 800
		},
		{
			name: 'Evaluare DIVA-5 + ABAS-II',
			description: 'Diagnostic ADHD adulți + comportament adaptativ',
			steps: [
				'30 min — interviu inițial',
				'2 h — administrare teste',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '4 h 30 min',
			price: 600
		},
		{
			name: 'Scala de Dezvoltare Portage + ABAS-II',
			description: 'Nivel de dezvoltare + comportament adaptativ',
			steps: [
				'2 h — interviu + administrare Portage',
				'1 h — administrare ABAS',
				'1 h — evaluarea copilului',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție părinte'
			],
			totalTime: '6 h',
			price: 800
		},
		{
			name: 'Evaluare ASEBA 6–11 ani',
			description: 'Tulburări de internalizare & externalizare (CBCL + TRF cadru didactic)',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare CBCL (TRF se trimite cadrului didactic)',
				'1 h 30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h 30 min',
			price: 500
		},
		{
			name: 'Evaluare ASEBA 11–18 ani',
			description: 'Tulburări de internalizare & externalizare (CBCL + YSR autoevaluare + TRF cadru didactic)',
			steps: [
				'30 min — interviu inițial',
				'1 h — administrare CBCL',
				'1 h — administrare YSR',
				'+ TRF trimis cadrului didactic',
				'2 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '5 h',
			price: 700
		},
		{
			name: 'Evaluare Depresie BECK / BDI',
			description: 'Inventarul de depresie Beck',
			steps: [
				'30 min — discuție inițială',
				'30 min — administrare test',
				'30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '2 h',
			price: 270
		},
		{
			name: 'Evaluare BDI + ABAS-II',
			description: 'Depresie Beck + comportament adaptativ',
			steps: [
				'30 min — discuție inițială',
				'30 min — administrare BDI',
				'30 min – 1 h — administrare ABAS',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h – 3 h 30 min',
			price: 450
		},
		{
			name: 'Evaluare BDI + Inventarul Big Five (Personalitate)',
			description: 'Depresie Beck + profil de personalitate Big Five',
			steps: [
				'30 min — discuție inițială',
				'30 min — administrare BDI',
				'1 h — administrare Big Five',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h 30 min',
			price: 450
		},
		{
			name: 'Evaluare MMSE (Deteriorare Cognitivă)',
			description: 'Mini-Mental State Examination pentru screeningul demenței și deteriorării cognitive',
			steps: [
				'1 h — administrare test',
				'30 min — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '2 h',
			price: 250
		},
		{
			name: 'Evaluare MMSE + ABAS-II',
			description: 'Deteriorare cognitivă + comportament adaptativ',
			steps: [
				'1 h — administrare test',
				'1 h — administrare ABAS',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h 30 min',
			price: 450
		},
		{
			name: 'Evaluare D2 (Atenție și Concentrare, 11–19 ani)',
			description: 'Test de atenție susținută și concentrare',
			steps: [
				'1 h — interviu inițial cu părintele',
				'1 h — aplicare test',
				'1 h — scorare + eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h 30 min',
			price: 450
		},
		{
			name: 'Evaluare Logopedică',
			description: 'Evaluarea abilităților de limbaj și comunicare',
			steps: [
				'30 min — discuție inițială',
				'1 h — evaluarea copilului',
				'1 h — eliberare raport',
				'30 min — discuție finală'
			],
			totalTime: '3 h',
			price: 400
		},
		{
			name: 'Evaluare Anexa 8 — Încadrare în grad de handicap / Orientare școlară',
			description: 'Evaluare pentru comisiile de orientare școlară și profesională sau grad de handicap (include raport cu timbru)',
			steps: [
				'0–6 ani: 1 h administrare Portage + 1 h eliberare Anexă',
				'7–18 ani: 1 h administrare Raven + 1 h eliberare Anexă'
			],
			totalTime: '2 h',
			price: 350
		}
	];
}
