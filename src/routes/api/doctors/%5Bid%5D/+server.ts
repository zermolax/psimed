import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

/**
 * GET /api/doctors/[id]
 *
 * Returns single doctor with all details and services
 *
 * EXAMPLE RESPONSE:
 * {
 *   id: "uuid",
 *   name: "Dr. Teodora PARASCHIV",
 *   speciality: "Psychiatrist",
 *   phone: "+40...",
 *   workingHoursStart: "09:00",
 *   workingHoursEnd: "17:00",
 *   services: [...]
 * }
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
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
      }
    });

    if (!doctor) {
      return json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (!doctor.isActive) {
      return json({ error: 'Doctor is not available' }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, isActive, ...safeDoctor } = doctor;

    return json(safeDoctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
};
