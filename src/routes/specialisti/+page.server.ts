import type { PageServerLoad } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

// Local descriptions for specialists (optional enrichment)
// Key is the doctor name (as it appears in API) for matching
const localDescriptions: Record<
	string,
	{
		description?: string;
		category?: 'psihiatru' | 'psiholog' | 'terapeut' | 'alt-specialist';
	}
> = {
	// Add custom descriptions here as needed
	// 'Dr. Popescu Maria': {
	//   description: 'Cu peste 15 ani de experiență...',
	//   category: 'psihiatru'
	// }
};

// Default descriptions by specialty
function getDefaultDescription(specialtyName: string, grade?: string): string {
	const gradeText = grade ? `${grade} ` : '';

	if (specialtyName.toLowerCase().includes('psihiatrie pediatric')) {
		return `${gradeText}specializat în evaluarea și tratamentul tulburărilor psihice la copii și adolescenți. Abordare caldă și empatică adaptată nevoilor fiecărui pacient tânăr.`;
	}
	if (specialtyName.toLowerCase().includes('psihiatrie')) {
		return `${gradeText}cu experiență în diagnosticul și tratamentul tulburărilor psihice la adulți. Oferă îngrijire personalizată și un plan de tratament adaptat fiecărui pacient.`;
	}
	if (specialtyName.toLowerCase().includes('psiholog')) {
		return `Psiholog clinician specializat în evaluări psihologice și psihoterapie. Abordare bazată pe dovezi pentru a ajuta pacienții să-și atingă obiectivele terapeutice.`;
	}
	if (specialtyName.toLowerCase().includes('psihoterapi')) {
		return `Psihoterapeut cu experiență în diverse forme de terapie. Ajută pacienții să depășească provocările emoționale și să-și îmbunătățească calitatea vieții.`;
	}
	if (specialtyName.toLowerCase().includes('kineto')) {
		return `Specialist în recuperare și reabilitare. Oferă tratamente personalizate pentru îmbunătățirea mobilității și funcționalității.`;
	}

	return `Specialist dedicat îngrijirii pacienților. Oferă servicii de calitate într-un mediu profesionist și primitor.`;
}

// Determine category from specialty name
function getCategoryFromSpecialty(specialtyName: string): 'psihiatru' | 'psiholog' | 'terapeut' | 'alt-specialist' {
	const name = specialtyName.toLowerCase();

	if (name.includes('psihiatrie') || name.includes('psihiatru')) {
		return 'psihiatru';
	}
	if (name.includes('psiholog')) {
		return 'psiholog';
	}
	if (name.includes('psihoterapi') || name.includes('terapeut')) {
		return 'terapeut';
	}
	return 'alt-specialist';
}

export const load: PageServerLoad = async () => {
	try {
		// Fetch all locations first
		const locations = await medsoft.getClinicLocations();

		// Fetch doctors for each location
		const allDoctors = await Promise.all(
			locations.map((loc) => medsoft.getLocationDoctors(loc.LocationId))
		);

		// Flatten and deduplicate doctors by DoctorId
		const doctorMap = new Map<number, (typeof allDoctors)[0][0]>();
		for (const doctors of allDoctors) {
			for (const doctor of doctors) {
				if (!doctorMap.has(doctor.DoctorId)) {
					doctorMap.set(doctor.DoctorId, doctor);
				}
			}
		}

		// Transform to our specialist format
		const specialists = Array.from(doctorMap.values()).map((doctor) => {
			const localData = localDescriptions[doctor.Name] || {};
			const category = localData.category || getCategoryFromSpecialty(doctor.SpecialtyName);

			return {
				id: doctor.DoctorId.toString(),
				name: doctor.Name,
				title: doctor.Grade || 'Medic Specialist',
				specialties: [doctor.SpecialtyName],
				description: localData.description || getDefaultDescription(doctor.SpecialtyName, doctor.Grade),
				category,
				doctorId: doctor.DoctorId
			};
		});

		// Sort: psihiatri first, then psihologi, then terapeuti, then others
		const categoryOrder = { psihiatru: 0, psiholog: 1, terapeut: 2, 'alt-specialist': 3 };
		specialists.sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);

		return {
			specialists,
			fromApi: true
		};
	} catch (error) {
		console.error('Error fetching specialists from API:', error);

		// Fallback to static data
		const { specialists: staticSpecialists } = await import('$lib/data/specialists');

		return {
			specialists: staticSpecialists,
			fromApi: false
		};
	}
};
