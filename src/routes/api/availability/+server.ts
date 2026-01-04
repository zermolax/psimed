import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAvailableSlots } from '$lib/server/services/booking.service';

/**
 * GET /api/availability
 *
 * Query parameters:
 * - doctorId: string (required)
 * - serviceId: string (required)
 * - date: string (required, format: YYYY-MM-DD)
 *
 * EXAMPLE REQUEST:
 * GET /api/availability?doctorId=uuid&serviceId=uuid&date=2026-01-15
 *
 * EXAMPLE RESPONSE:
 * {
 *   doctorId: "uuid",
 *   serviceId: "uuid",
 *   date: "2026-01-15",
 *   slots: [
 *     { time: "09:00", available: true },
 *     { time: "10:00", available: false }, // already booked
 *     { time: "11:00", available: true },
 *     ...
 *   ]
 * }
 */
export const GET: RequestHandler = async ({ url }) => {
  try {
    const doctorId = url.searchParams.get('doctorId');
    const serviceId = url.searchParams.get('serviceId');
    const date = url.searchParams.get('date');

    // Validate required parameters
    if (!doctorId || !serviceId || !date) {
      return json(
        { error: 'Missing required parameters: doctorId, serviceId, date' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: 'Date must be in format YYYY-MM-DD' }, { status: 400 });
    }

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return json({ error: 'Cannot book appointments in the past' }, { status: 400 });
    }

    // Get available slots
    const slots = await getAvailableSlots(doctorId, serviceId, date);

    return json({
      doctorId,
      serviceId,
      date,
      slots
    });
  } catch (error: any) {
    console.error('Error fetching availability:', error);

    // Handle specific service errors
    if (error.message.includes('Doctor not found')) {
      return json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (error.message.includes('Service not found')) {
      return json({ error: 'Service not found' }, { status: 404 });
    }

    if (error.message.includes('does not belong')) {
      return json({ error: 'Service does not belong to doctor' }, { status: 400 });
    }

    return json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
};
