import type { PageServerLoad } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const load: PageServerLoad = async () => {
	try {
		// Fetch appointment scopes which contain services and prices
		const scopes = await medsoft.getAppointmentScopes();

		// Transform to a format suitable for the PriceTable component
		const priceItems = scopes.flatMap((scope) => {
			if (scope.lista_servicii && scope.lista_servicii.length > 0) {
				return scope.lista_servicii.map((service) => ({
					name: service.denumire,
					price: service.pret,
					duration: scope.durata,
					category: categorizeService(scope.scop, service.denumire)
				}));
			}
			// If no lista_servicii, create an item from the scope itself
			return [
				{
					name: scope.scop,
					price: 0, // Price not available at scope level
					duration: scope.durata,
					category: categorizeService(scope.scop, scope.scop)
				}
			];
		});

		// Filter out items without prices and remove duplicates
		const uniqueItems = priceItems
			.filter((item) => item.price > 0)
			.filter(
				(item, index, self) =>
					index === self.findIndex((t) => t.name === item.name && t.price === item.price)
			);

		return {
			priceItems: uniqueItems,
			success: true
		};
	} catch (error) {
		console.error('Error fetching prices:', error);
		return {
			priceItems: getStaticPrices(),
			success: false
		};
	}
};

// Categorize services based on name patterns
function categorizeService(scopName: string, serviceName: string): string {
	const name = (scopName + ' ' + serviceName).toLowerCase();

	if (name.includes('consult') || name.includes('prima vizită')) {
		return 'Consultații';
	}
	if (name.includes('evaluare') || name.includes('test') || name.includes('psihodiagnostic')) {
		return 'Evaluări Psihologice';
	}
	if (name.includes('terapie') || name.includes('psihoterapie') || name.includes('ședință')) {
		return 'Psihoterapie';
	}
	if (name.includes('neurofeedback') || name.includes('hipnoză') || name.includes('tratament')) {
		return 'Tratamente';
	}
	return 'Alte Servicii';
}

// Fallback static prices in case API fails
function getStaticPrices() {
	return [
		{
			name: 'Consultație Psihiatrică Adulți - Prima Vizită',
			price: 350,
			duration: 60,
			category: 'Consultații'
		},
		{
			name: 'Consultație Psihiatrică Adulți - Control',
			price: 250,
			duration: 30,
			category: 'Consultații'
		},
		{
			name: 'Consultație Psihiatrie Pediatrică - Prima Vizită',
			price: 400,
			duration: 60,
			category: 'Consultații'
		},
		{
			name: 'Consultație Psihiatrie Pediatrică - Control',
			price: 300,
			duration: 30,
			category: 'Consultații'
		},
		{
			name: 'Evaluare Psihologică Completă Copii',
			price: 800,
			duration: 180,
			category: 'Evaluări Psihologice'
		},
		{
			name: 'Evaluare Psihologică Completă Adulți',
			price: 600,
			duration: 120,
			category: 'Evaluări Psihologice'
		},
		{
			name: 'Test ADHD (Conners)',
			price: 200,
			duration: 60,
			category: 'Evaluări Psihologice'
		},
		{
			name: 'Ședință Psihoterapie Individuală',
			price: 200,
			duration: 50,
			category: 'Psihoterapie'
		},
		{
			name: 'Ședință Terapie de Cuplu',
			price: 300,
			duration: 90,
			category: 'Psihoterapie'
		},
		{
			name: 'Ședință Neurofeedback',
			price: 150,
			duration: 45,
			category: 'Tratamente'
		},
		{
			name: 'Ședință Hipnoză Clinică',
			price: 250,
			duration: 60,
			category: 'Tratamente'
		}
	];
}
