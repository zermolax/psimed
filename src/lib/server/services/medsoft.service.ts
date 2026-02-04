/**
 * MedSoft CLOUD API Integration Service
 *
 * This service handles all communication with the MedSoft API
 * for the appointment booking system.
 *
 * API Documentation: Specificații Interconectare Cont Online v11
 */

import { MEDSOFT_API_KEY, MEDSOFT_API_URL, MEDSOFT_CLIENT_PATH } from '$env/static/private';

// Types based on MedSoft API responses
export interface MedSoftDoctor {
  cod: number;
  cod_punct_lucru: number;
  nume: string;
  prenume: string;
  specialitate: string;
  cod_specialitate: number;
  interval_programare: number;
  telefon?: string;
  email?: string;
  activ_cont_online: number;
}

export interface MedSoftPatient {
  cod_pacient: number;
  cnp?: string;
  nume: string;
  prenume: string;
  data_nastere?: string;
  tel: string;
  email?: string;
}

export interface MedSoftAppointment {
  _cod_programare: number;
  _cod_pacient: number;
  _status_1: boolean;
  _status_2: boolean;
  _status_3: boolean;
  _status_4: boolean;
  _status_5: boolean;
  _status_6: boolean;
  _status_7: boolean;
  _status_8: boolean;
  _status_9: boolean;
  _status_10: boolean;
  Doctor: string;
  Data: string;
  'Ora inceput': string;
  'Ora sfarsit': string;
  'Punct lucru': string;
  Cabinet: string;
  Scop: string;
}

export interface MedSoftStatusProgramare {
  index: number;
  activ: number;
  denumire: string;
  culoare: string;
  is_programare_displayed: number;
  is_programare_succes: number;
}

export interface MedSoftService {
  cod: number;
  denumire: string;
  punct_lucru: number;
  pret: number;
  valuta: string;
  tip_serviciu: string;
  data_adaugare_modificare: string;
}

export interface MedSoftApiResponse<T> {
  Status: number;
  ReturnData: T[];
}

class MedSoftService {
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
    const url = `${this.baseUrl}/integrations/cont-online/public/${this.clientPath}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`MedSoft API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // =====================================================
  // DOCTORS / MEDICI
  // =====================================================

  /**
   * Get list of doctors available for online appointments
   */
  async getDoctors(codPunctLucru?: number): Promise<MedSoftDoctor[]> {
    let endpoint = '/medici';
    if (codPunctLucru) {
      endpoint += `?cod_punct_lucru=${codPunctLucru}`;
    }

    const response = await this.request<MedSoftDoctor>(endpoint);
    return response.ReturnData;
  }

  /**
   * Get a specific doctor by code
   */
  async getDoctor(codMedic: number): Promise<MedSoftDoctor | null> {
    const endpoint = `/medici?cod_medic=${codMedic}`;
    const response = await this.request<MedSoftDoctor>(endpoint);
    return response.ReturnData[0] || null;
  }

  // =====================================================
  // SERVICES / LISTA PRETURI
  // =====================================================

  /**
   * Get list of services available for online booking
   */
  async getServices(tipServiciu?: string): Promise<MedSoftService[]> {
    let endpoint = '/listaPreturi';
    if (tipServiciu) {
      endpoint += `?tipServiciu=${tipServiciu}`;
    }

    const response = await this.request<MedSoftService>(endpoint);
    return response.ReturnData;
  }

  // =====================================================
  // PATIENTS / PACIENTI
  // =====================================================

  /**
   * Search for an existing patient
   */
  async searchPatient(params: {
    search?: string;
    nume?: string;
    prenume?: string;
    telefon?: string;
    dataNastere?: string;
    cnp?: string;
    cod_pacient?: number;
  }): Promise<MedSoftPatient[]> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.nume) queryParams.append('nume', params.nume);
    if (params.prenume) queryParams.append('prenume', params.prenume);
    if (params.telefon) queryParams.append('telefon', params.telefon);
    if (params.dataNastere) queryParams.append('dataNastere', params.dataNastere);
    if (params.cnp) queryParams.append('cnp', params.cnp);
    if (params.cod_pacient) queryParams.append('cod_pacient', params.cod_pacient.toString());

    const endpoint = `/pacient/cauta?${queryParams.toString()}`;
    const response = await this.request<MedSoftPatient>(endpoint);
    return response.ReturnData;
  }

  /**
   * Create a new patient in MedSoft
   */
  async createPatient(patient: {
    nume: string;
    prenume: string;
    tel1: string;
    email?: string;
    tel2?: string;
    cnp?: string;
    sex?: '1' | '2' | null;
    preferinte?: string;
  }): Promise<MedSoftPatient> {
    const response = await this.request<MedSoftPatient>('/pacient', {
      method: 'POST',
      body: JSON.stringify(patient),
    });

    if (!response.ReturnData[0]) {
      throw new Error('Failed to create patient');
    }

    return response.ReturnData[0];
  }

  /**
   * Update an existing patient
   */
  async updatePatient(
    codPacient: number,
    patient: {
      nume?: string;
      prenume?: string;
      tel1?: string;
      email?: string;
      tel2?: string;
      cnp?: string;
      sex?: '1' | '2' | null;
      preferinte?: string;
    }
  ): Promise<MedSoftPatient> {
    const response = await this.request<MedSoftPatient>(`/pacient/${codPacient}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });

    if (!response.ReturnData[0]) {
      throw new Error('Failed to update patient');
    }

    return response.ReturnData[0];
  }

  // =====================================================
  // APPOINTMENTS / PROGRAMARI
  // =====================================================

  /**
   * Get appointment history for a patient
   */
  async getPatientAppointments(codPacient: number): Promise<MedSoftAppointment[]> {
    const endpoint = `/pacient/${codPacient}/istoric/programari`;
    const response = await this.request<MedSoftAppointment>(endpoint);
    return response.ReturnData;
  }

  /**
   * Get appointment status definitions
   */
  async getAppointmentStatuses(): Promise<MedSoftStatusProgramare[]> {
    const response = await this.request<MedSoftStatusProgramare>('/statusProgramari');
    return response.ReturnData;
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    codPacient: number,
    codProgramare: number,
    flagIndex: number,
    newFlagValue: boolean,
    motiv?: string
  ): Promise<MedSoftAppointment> {
    let endpoint = `/pacient/${codPacient}/istoric/programari/${codProgramare}/status/${flagIndex}/${newFlagValue}`;
    if (motiv) {
      endpoint += `?motiv=${encodeURIComponent(motiv)}`;
    }

    const response = await this.request<MedSoftAppointment>(endpoint, {
      method: 'PUT',
    });

    if (!response.ReturnData[0]) {
      throw new Error('Failed to update appointment status');
    }

    return response.ReturnData[0];
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Find or create a patient by phone/email
   * Returns the patient code for use in appointments
   */
  async findOrCreatePatient(patientData: {
    nume: string;
    prenume: string;
    telefon: string;
    email?: string;
  }): Promise<MedSoftPatient> {
    // First try to find by phone
    const existingByPhone = await this.searchPatient({ telefon: patientData.telefon });
    if (existingByPhone.length > 0) {
      return existingByPhone[0];
    }

    // Try to find by email if provided
    if (patientData.email) {
      const existingByEmail = await this.searchPatient({ search: patientData.email });
      if (existingByEmail.length > 0) {
        return existingByEmail[0];
      }
    }

    // Create new patient
    return this.createPatient({
      nume: patientData.nume,
      prenume: patientData.prenume,
      tel1: patientData.telefon,
      email: patientData.email,
    });
  }

  /**
   * Check if the API connection is working
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getDoctors();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const medsoft = new MedSoftService();
