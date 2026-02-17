/**
 * MedSoft CLOUD API Integration Service
 *
 * This service handles all communication with the MedSoft API
 * for the online appointment booking system.
 *
 * API Documentation: Specificații Interconectare Programări Online v2
 */

import { MEDSOFT_API_KEY, MEDSOFT_API_URL, MEDSOFT_CLIENT_PATH } from '$env/static/private';

// =====================================================
// TYPES
// =====================================================

export interface ClinicLocation {
	LocationId: number;
	LocationName: string;
	LocationAddress?: string;
}

export interface LocationSpecialty {
	LocationId: number;
	SpecialtyId: number;
	Name: string;
}

export interface LocationDoctor {
	LocationId: number;
	DoctorId: number;
	Name: string;
	Grade?: string;
	SpecialtyId: number;
	SpecialtyName: string;
	SlotDuration: number;
	email?: string;
}

export interface ScheduleSlot {
	DoctorId: number;
	StartDateTime: string;
	EndDateTime: string;
	IsAvailable: number;
	SpecialtyId: number;
	LocationId: number;
}

export interface AppointmentScop {
	cod: number;
	scop: string;
	durata: number;
	medic?: number;
	puncte_lucru?: string;
	lista_servicii?: Array<{
		cod: number;
		pret: number;
		denumire: string;
		puncte_lucru?: string | null;
	}>;
}

export interface PriceListItem {
	cod: number;
	denumire: string;
	punct_lucru: number;
	pret: number;
	valuta: string;
	tip_serviciu: string;
}

export interface CreateAppointmentRequest {
	doctorId: number;
	locationId: number;
	startDateTime: string;
	endDateTime: string;
	patientName: string;
	patientEmail?: string;
	patientPhoneNumber: string;
	patientAddress?: object | null;
	appointmentDetails?: string;
	appointmentNotes?: string;
	scopId?: number;
}

export interface AppointmentResponse {
	AppointmentId: number;
}

export interface AppointmentStatus {
	appointment: number;
	doctorId: number;
	locationId: number;
	startDateTime: string;
	endDateTime: string;
	appointmentDetails: string;
	patientId: number;
	patientName: string;
	lastEditDateTime: string;
	statusList: string;
	deleteDateTime?: string;
}

export interface ValidatePatientResponse {
	codPacient: number;
	tel: string;
	numePacient: string;
}

export interface MedSoftApiResponse<T> {
	Status: number;
	ReturnData: T[];
}

// =====================================================
// SERVICE CLASS
// =====================================================

class MedSoftAPIService {
	private baseUrl: string;
	private apiKey: string;
	private clientPath: string;

	constructor() {
		this.baseUrl = MEDSOFT_API_URL || '';
		this.apiKey = MEDSOFT_API_KEY || '';
		this.clientPath = MEDSOFT_CLIENT_PATH || '';
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<MedSoftApiResponse<T>> {
		const url = `${this.baseUrl}/integrations/programari-online/public/${this.clientPath}${endpoint}`;

		console.log(`[MedSoft API] ${options.method || 'GET'} ${url}`);

		const response = await fetch(url, {
			...options,
			headers: {
				'X-API-KEY': this.apiKey,
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[MedSoft API] Error ${response.status}: ${errorText}`);
			throw new Error(`MedSoft API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	}

	// =====================================================
	// LOCATIONS
	// =====================================================

	/**
	 * Get all clinic locations
	 */
	async getClinicLocations(): Promise<ClinicLocation[]> {
		const response = await this.request<ClinicLocation>('/clinicLocations');
		return response.ReturnData;
	}

	// =====================================================
	// SPECIALTIES
	// =====================================================

	/**
	 * Get specialties available at a location
	 */
	async getLocationSpecialties(locationId: number): Promise<LocationSpecialty[]> {
		const response = await this.request<LocationSpecialty>(
			`/locationSpecialties?locationId=${locationId}`
		);
		return response.ReturnData;
	}

	// =====================================================
	// DOCTORS
	// =====================================================

	/**
	 * Get doctors available at a location
	 * Optionally filter by specialty
	 */
	async getLocationDoctors(locationId: number, specialtyId?: number): Promise<LocationDoctor[]> {
		const response = await this.request<LocationDoctor>(`/locationDoctors?locationId=${locationId}`);
		let doctors = response.ReturnData;

		if (specialtyId) {
			doctors = doctors.filter((d) => d.SpecialtyId === specialtyId);
		}

		return doctors;
	}

	// =====================================================
	// SCHEDULE
	// =====================================================

	/**
	 * Get schedule for a location (all doctors)
	 * Returns available time slots
	 */
	async getLocationSchedule(
		locationId: number,
		dateStart: string,
		dateEnd: string
	): Promise<ScheduleSlot[]> {
		const response = await this.request<ScheduleSlot>(
			`/locationSchedule?locationId=${locationId}&date=${dateStart}&dateEnd=${dateEnd}`
		);
		return response.ReturnData;
	}

	/**
	 * Get schedule for a specific doctor
	 */
	async getDoctorSchedule(
		doctorId: number,
		dateStart: string,
		dateEnd: string
	): Promise<ScheduleSlot[]> {
		const response = await this.request<ScheduleSlot>(
			`/doctorSchedule?doctorId=${doctorId}&date=${dateStart}&dateEnd=${dateEnd}`
		);
		return response.ReturnData;
	}

	// =====================================================
	// APPOINTMENT SCOPES (Services/Purposes)
	// =====================================================

	/**
	 * Get appointment scopes (purposes/services)
	 * These define what type of appointment can be booked
	 */
	async getAppointmentScopes(): Promise<AppointmentScop[]> {
		const response = await this.request<AppointmentScop>('/appointmentScop');
		return response.ReturnData;
	}

	/**
	 * Get scopes filtered by doctor
	 */
	async getAppointmentScopesForDoctor(doctorId: number): Promise<AppointmentScop[]> {
		const allScopes = await this.getAppointmentScopes();
		return allScopes.filter((s) => s.medic === doctorId || !s.medic);
	}

	// =====================================================
	// PRICE LIST
	// =====================================================

	/**
	 * Get price list for services
	 */
	async getPriceList(): Promise<PriceListItem[]> {
		const response = await this.request<PriceListItem>('/priceList');
		return response.ReturnData;
	}

	// =====================================================
	// PATIENT VALIDATION
	// =====================================================

	/**
	 * Validate/find a patient by their data
	 */
	async validatePatient(patient: {
		nume: string;
		prenume: string;
		tel: string;
		email?: string;
	}): Promise<ValidatePatientResponse | null> {
		try {
			const response = await this.request<ValidatePatientResponse>('/validare-pacient', {
				method: 'POST',
				body: JSON.stringify(patient)
			});
			return response.ReturnData[0] || null;
		} catch {
			return null;
		}
	}

	// =====================================================
	// APPOINTMENTS
	// =====================================================

	/**
	 * Create a new appointment
	 */
	async createAppointment(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
		console.log('[MedSoft API] Creating appointment with data:', JSON.stringify(data, null, 2));

		const response = await this.request<AppointmentResponse>('/createAppointment', {
			method: 'POST',
			body: JSON.stringify(data)
		});

		console.log('[MedSoft API] Create appointment response:', JSON.stringify(response, null, 2));

		// Check if response has ReturnData
		if (!response.ReturnData || !Array.isArray(response.ReturnData)) {
			console.error('[MedSoft API] Invalid response format:', response);
			throw new Error(`Răspuns invalid de la MedSoft API: ${JSON.stringify(response)}`);
		}

		if (response.ReturnData.length === 0) {
			// Check if there's an error in the response
			const errorResponse = response as unknown as { Status: number; ErrorMessage?: string; Message?: string };
			const errorMsg = errorResponse.ErrorMessage || errorResponse.Message || 'Nu s-a putut crea programarea';
			throw new Error(errorMsg);
		}

		return response.ReturnData[0];
	}

	/**
	 * Get appointment status
	 */
	async getAppointmentStatus(appointmentId: number): Promise<AppointmentStatus | null> {
		const response = await this.request<AppointmentStatus>(
			`/appointmentStatus?appointment=${appointmentId}`
		);
		return response.ReturnData[0] || null;
	}

	/**
	 * Cancel an appointment
	 */
	async cancelAppointment(
		appointmentId: number
	): Promise<{ cancellationResult: boolean; message: string }> {
		const response = await this.request<{ cancellationResult: boolean; message: string }>(
			`/cancelAppointment?appointment=${appointmentId}`,
			{ method: 'POST' }
		);
		return response.ReturnData[0];
	}

	// =====================================================
	// UTILITY METHODS
	// =====================================================

	/**
	 * Generate time slots from a schedule slot based on duration
	 */
	generateTimeSlots(scheduleSlot: ScheduleSlot, durationMinutes: number): string[] {
		const slots: string[] = [];
		const start = new Date(scheduleSlot.StartDateTime);
		const end = new Date(scheduleSlot.EndDateTime);

		let current = new Date(start);
		while (current.getTime() + durationMinutes * 60000 <= end.getTime()) {
			slots.push(current.toISOString());
			current = new Date(current.getTime() + durationMinutes * 60000);
		}

		return slots;
	}

	/**
	 * Check if the API connection is working
	 */
	async healthCheck(): Promise<boolean> {
		try {
			await this.getClinicLocations();
			return true;
		} catch {
			return false;
		}
	}
}

// Export singleton instance
export const medsoft = new MedSoftAPIService();
