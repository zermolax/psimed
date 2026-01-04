import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

/**
 * GET /api/bookings/public
 *
 * Public endpoint to get booking details by confirmation token
 * Query parameter: token=xxx
 *
 * Used by confirmation page after successful booking
 */
export const GET: RequestHandler = async ({ url }) => {
  try {
    const token = url.searchParams.get('token');

    if (!token) {
      return json({ error: 'Confirmation token is required' }, { status: 400 });
    }

    // Find booking by confirmation token
    const booking = await prisma.booking.findUnique({
      where: { confirmationToken: token },
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true,
            duration: true,
            price: true
          }
        }
      }
    });

    if (!booking) {
      return json({ error: 'Booking not found' }, { status: 404 });
    }

    return json(booking);
  } catch (error) {
    console.error('Error fetching public booking:', error);
    return json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
};
