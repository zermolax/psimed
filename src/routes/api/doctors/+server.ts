import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

/**
 * GET /api/doctors
 *
 * Returns list of all active doctors with their services.
 *
 * RESPONSE:
 * [
 *   {
 *     id: "uuid",
 *     name: "Dr. Teodora PARASCHIV",
 *     speciality: "Psychiatrist",
 *     phone: "+40...",
 *     workingHoursStart: "09:00",
 *     workingHoursEnd: "17:00",
 *     services: [
 *       { id: "uuid", name: "Psychiatric Consultation", duration: 1, price: 150 },
 *       ...
 *     ]
 *   }
 * ]
 */
export const GET: RequestHandler = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Remove passwordHash from response
    const safeDoctors = doctors.map(({ passwordHash, ...rest }) => rest);

    return json(safeDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
};
