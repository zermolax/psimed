import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

/**
 * POST - Find or create a patient
 * This endpoint handles patient registration for appointments
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    const { nume, prenume, telefon, email } = body;

    // Validate required fields
    if (!nume || !prenume || !telefon) {
      return json(
        {
          success: false,
          error: 'Nume, prenume și telefon sunt obligatorii.',
        },
        { status: 400 }
      );
    }

    // Find or create patient in MedSoft
    const patient = await medsoft.findOrCreatePatient({
      nume: nume.toUpperCase(),
      prenume: prenume.toUpperCase(),
      telefon,
      email,
    });

    return json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Error handling patient in MedSoft:', error);
    return json(
      {
        success: false,
        error: 'Nu s-a putut procesa pacientul. Vă rugăm încercați din nou.',
      },
      { status: 500 }
    );
  }
};

/**
 * GET - Search for a patient
 */
export const GET: RequestHandler = async ({ url }) => {
  try {
    const telefon = url.searchParams.get('telefon');
    const email = url.searchParams.get('email');
    const cnp = url.searchParams.get('cnp');

    if (!telefon && !email && !cnp) {
      return json(
        {
          success: false,
          error: 'Trebuie să specificați telefon, email sau CNP pentru căutare.',
        },
        { status: 400 }
      );
    }

    const patients = await medsoft.searchPatient({
      telefon: telefon || undefined,
      search: email || undefined,
      cnp: cnp || undefined,
    });

    return json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error('Error searching patient in MedSoft:', error);
    return json(
      {
        success: false,
        error: 'Nu s-a putut căuta pacientul. Vă rugăm încercați din nou.',
      },
      { status: 500 }
    );
  }
};
