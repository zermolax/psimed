import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const codPunctLucru = url.searchParams.get('punct_lucru');

    const doctors = await medsoft.getDoctors(
      codPunctLucru ? parseInt(codPunctLucru) : undefined
    );

    return json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors from MedSoft:', error);
    return json(
      {
        success: false,
        error: 'Nu s-au putut încărca medicii. Vă rugăm încercați din nou.',
      },
      { status: 500 }
    );
  }
};
