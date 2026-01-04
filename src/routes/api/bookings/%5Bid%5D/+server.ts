import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateBookingStatus, getBookingById } from '$lib/server/services/booking.service';
import { sendCancellationEmail } from '$lib/server/services/notification.service';
import { prisma } from '$lib/server/db';

/**
 * PATCH /api/bookings/[id]
 *
 * Update booking status (admin only)
 *
 * REQUEST BODY:
 * {
 *   status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
 *   cancellationReason?: string
 * }
 *
 * Requires authentication (doctor session)
 */
export const PATCH: RequestHandler = async ({ request, params, cookies }) => {
  try {
    // Authenticate
    const sessionCookie = cookies.get('doctor_session');

    if (!sessionCookie) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return json({ error: 'Invalid session' }, { status: 401 });
    }

    const doctorId = session.doctorId;
    const { id } = params;

    if (!id) {
      return json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { status, cancellationReason } = body;

    if (!status) {
      return json({ error: 'Status is required' }, { status: 400 });
    }

    // Get current booking
    const currentBooking = await getBookingById(id);

    if (!currentBooking) {
      return json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify doctor owns this booking
    if (currentBooking.doctorId !== doctorId) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update status
    const updated = await updateBookingStatus(id, status, doctorId);

    // If cancelling, send cancellation email
    if (status === 'CANCELLED') {
      try {
        const doctor = await prisma.doctor.findUnique({
          where: { id: doctorId }
        });

        const service = await prisma.service.findUnique({
          where: { id: currentBooking.serviceId }
        });

        if (doctor && service) {
          await sendCancellationEmail(currentBooking, doctor.name, service.name, cancellationReason);
        }
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // Don't fail the update if email fails
      }
    }

    return json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);

    if (error.message.includes('Unauthorized')) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    return json({ error: 'Failed to update booking' }, { status: 500 });
  }
};

/**
 * GET /api/bookings/[id]
 *
 * Get single booking details (by confirmation token or ID)
 *
 * If this is a public request (no session), only returns if token is provided
 * If authenticated, can get any booking (owned by doctor)
 */
export const GET: RequestHandler = async ({ params, url, cookies }) => {
  try {
    const { id } = params;

    // Check if this is a token-based request (public)
    const token = url.searchParams.get('token');

    if (token) {
      // Public access via confirmation token
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
    }

    // Otherwise require authentication
    const sessionCookie = cookies.get('doctor_session');

    if (!sessionCookie) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return json({ error: 'Invalid session' }, { status: 401 });
    }

    const doctorId = session.doctorId;

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true
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

    // Verify doctor owns this booking
    if (booking.doctorId !== doctorId) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    return json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
};
