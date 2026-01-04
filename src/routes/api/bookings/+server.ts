import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createBooking } from '$lib/server/services/booking.service';
import { sendBookingConfirmation, sendDoctorNotification } from '$lib/server/services/notification.service';
import { prisma } from '$lib/server/db';

/**
 * POST /api/bookings
 *
 * Create a new booking.
 *
 * REQUEST BODY:
 * {
 *   doctorId: string,
 *   serviceId: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:MM),
 *   patientName: string,
 *   patientEmail: string,
 *   patientPhone: string,
 *   patientNotes?: string
 * }
 *
 * RESPONSE (201):
 * {
 *   success: true,
 *   booking: {
 *     id: "uuid",
 *     patientName: "John Doe",
 *     ...
 *   },
 *   confirmationToken: "ABC123"
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Create booking (validates input with Zod)
    const booking = await createBooking(body);

    console.log('✅ Booking created:', booking.id);

    // Get doctor and service details for emails
    const doctor = await prisma.doctor.findUnique({
      where: { id: booking.doctorId }
    });

    const service = await prisma.service.findUnique({
      where: { id: booking.serviceId }
    });

    if (!doctor || !service) {
      throw new Error('Doctor or service not found');
    }

    // Send confirmation email to patient
    try {
      await sendBookingConfirmation(booking, doctor.name, service.name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails - log and continue
    }

    // Send notification email to doctor
    try {
      await sendDoctorNotification(booking, doctor.email, doctor.name, service.name);
    } catch (emailError) {
      console.error('Failed to send doctor notification:', emailError);
    }

    return json(
      {
        success: true,
        message: 'Booking created successfully',
        booking: {
          id: booking.id,
          patientName: booking.patientName,
          patientEmail: booking.patientEmail,
          appointmentDate: booking.appointmentDate,
          status: booking.status,
          confirmationToken: booking.confirmationToken
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);

    // Handle specific validation errors
    if (error instanceof Error) {
      const message = error.message;

      if (message.includes('validation')) {
        return json({ error: 'Invalid booking data' }, { status: 400 });
      }

      if (message.includes('not found') || message.includes('does not exist')) {
        return json({ error: message }, { status: 404 });
      }

      if (message.includes('not available')) {
        return json({ error: 'Selected time slot is not available' }, { status: 409 });
      }

      return json({ error: message }, { status: 400 });
    }

    return json({ error: 'Failed to create booking' }, { status: 500 });
  }
};

/**
 * GET /api/bookings
 *
 * Get bookings for authenticated doctor (requires session cookie)
 * Query parameters:
 * - status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
 * - fromDate?: ISO date string
 * - toDate?: ISO date string
 *
 * ADMIN ONLY - returns 401 if not authenticated
 */
export const GET: RequestHandler = async ({ request, cookies }) => {
  try {
    // Get session cookie
    const sessionCookie = cookies.get('doctor_session');

    if (!sessionCookie) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse session
    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return json({ error: 'Invalid session' }, { status: 401 });
    }

    const doctorId = session.doctorId;

    if (!doctorId) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as any;
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');

    // Build where clause
    const where: any = { doctorId };

    if (status) {
      where.status = status;
    }

    if (fromDate) {
      where.appointmentDate = { gte: new Date(fromDate) };
    }

    if (toDate) {
      where.appointmentDate = where.appointmentDate || {};
      where.appointmentDate.lte = new Date(toDate);
    }

    // Get bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            name: true,
            duration: true
          }
        }
      },
      orderBy: { appointmentDate: 'desc' }
    });

    return json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
};
