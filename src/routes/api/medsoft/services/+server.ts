import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medsoft } from '$lib/server/services/medsoft.service';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const tipServiciu = url.searchParams.get('tip');

    const services = await medsoft.getServices(tipServiciu || undefined);

    return json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services from MedSoft:', error);
    return json(
      {
        success: false,
        error: 'Nu s-au putut încărca serviciile. Vă rugăm încercați din nou.',
      },
      { status: 500 }
    );
  }
};
