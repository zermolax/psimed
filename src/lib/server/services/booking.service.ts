import { prisma } from '$lib/server/db';
import { createBookingSchema, updateBookingStatusSchema } from '$lib/server/validators/booking.validator';
import type { Booking, BookingStatus } from '@prisma/client';
import { z } from 'zod';

/**
 * EXPLANATION: Booking Service
 *
 * This service handles all booking logic:
 * - Calculate available time slots
 * - Create bookings
 * - Update booking status
 * - Get booking details
 *
 * SLOTS GENERATION:
 * We calculate available slots on-the-fly based on:
 * 1. Doctor's working hours (workingHoursStart, workingHoursEnd)
 * 2. Service duration (how long the service takes)
 * 3. Existing bookings (exclude booked times)
 */

interface TimeSlot {
  time: string; // "09:00"
  available: boolean; // false if already booked
}

interface AvailabilityResponse {
  doctorId: string;
  serviceId: string;
  date: string;
  slots: TimeSlot[];
}

/**
 * Get available time slots for a doctor on a specific date
 *
 * EXAMPLE:
 * - Doctor: Dr. Teodora (working 09:00-17:00)
 * - Service: Consultation (60 minutes)
 * - Date: 2026-01-15
 *
 * Generated slots: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00
 * (No 17:00 because 60-min service wouldn't fit before closing)
 *
 * Then we check existing bookings and mark as unavailable if booked.
 */
export async function getAvailableSlots(
  doctorId: string,
  serviceId: string,
  date: string
): Promise<TimeSlot[]> {
  // Get doctor to check working hours
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId }
  });

  if (!doctor) throw new Error('Doctor not found');

  // Get service to check duration
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) throw new Error('Service not found');
  if (service.doctorId !== doctorId) throw new Error('Service does not belong to doctor');

  // Get all bookings for this doctor on this date
  const bookings = await prisma.booking.findMany({
    where: {
      doctorId,
      appointmentDate: {
        gte: new Date(`${date}T00:00:00Z`),
        lt: new Date(`${date}T23:59:59Z`)
      },
      status: { not: 'CANCELLED' } // Don't count cancelled bookings
    }
  });

  // Generate all possible slots
  const slots: TimeSlot[] = [];

  // Parse doctor's working hours
  // Format: Could be "09:00" (string) or 900 (number - 9:00 AM in HHMM format)
  let startHour: number, startMin: number, endHour: number, endMin: number;

  if (typeof doctor.workingHoursStart === 'string') {
    [startHour, startMin] = doctor.workingHoursStart.split(':').map(Number);
  } else {
    // Handle number format (e.g., 900 = 09:00)
    startHour = Math.floor(doctor.workingHoursStart / 100);
    startMin = doctor.workingHoursStart % 100;
  }

  if (typeof doctor.workingHoursEnd === 'string') {
    [endHour, endMin] = doctor.workingHoursEnd.split(':').map(Number);
  } else {
    // Handle number format (e.g., 1700 = 17:00)
    endHour = Math.floor(doctor.workingHoursEnd / 100);
    endMin = doctor.workingHoursEnd % 100;
  }

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  // Duration is stored in MINUTES in the database
  const durationValue = typeof service.duration === 'string' ? parseInt(service.duration) : service.duration;
  const serviceDurationMinutes = durationValue; // duration is already in minutes

  // Generate 1-hour slots (standard appointment slots)
  for (let minutes = startMinutes; minutes + serviceDurationMinutes <= endMinutes; minutes += 60) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    // Check if this time slot is booked
    const isBooked = bookings.some((booking) => {
      const bookingHour = parseInt(booking.appointmentDate.toISOString().substring(11, 13));
      const bookingMin = parseInt(booking.appointmentDate.toISOString().substring(14, 16));
      const bookingMinutes = bookingHour * 60 + bookingMin;

      // Check if service duration overlaps
      return (
        bookingMinutes < minutes + serviceDurationMinutes &&
        bookingMinutes + booking.duration * 60 > minutes
      );
    });

    slots.push({
      time: timeStr,
      available: !isBooked
    });
  }

  return slots;
}

/**
 * Create a new booking
 *
 * FLOW:
 * 1. Validate input with Zod
 * 2. Check if slot is available (call getAvailableSlots)
 * 3. Generate unique confirmation token
 * 4. Create booking in database
 * 5. Return booking with confirmation token
 */
export async function createBooking(input: unknown): Promise<Booking> {
  // Validate with Zod schema
  const validatedData = createBookingSchema.parse(input);

  // Check if doctor exists
  const doctor = await prisma.doctor.findUnique({
    where: { id: validatedData.doctorId }
  });

  if (!doctor) throw new Error('Doctor not found');

  // Check if service exists and belongs to doctor
  const service = await prisma.service.findUnique({
    where: { id: validatedData.serviceId }
  });

  if (!service || service.doctorId !== doctor.id) {
    throw new Error('Service not found or does not belong to doctor');
  }

  // Check availability
  const slots = await getAvailableSlots(validatedData.doctorId, validatedData.serviceId, validatedData.date);

  // Format input time to match slot format
  const requestedSlot = slots.find((s) => s.time === validatedData.time && s.available);

  if (!requestedSlot) {
    throw new Error('Requested time slot is not available');
  }

  // Generate unique confirmation token (6 random alphanumeric)
  const confirmationToken = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Create appointment datetime
  const [hour, min] = validatedData.time.split(':').map(Number);
  const appointmentDate = new Date(`${validatedData.date}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`);

  // Create booking in database
  const booking = await prisma.booking.create({
    data: {
      patientName: validatedData.patientName,
      patientEmail: validatedData.patientEmail,
      patientPhone: validatedData.patientPhone,
      patientNote: validatedData.patientNotes,
      doctorId: validatedData.doctorId,
      serviceId: validatedData.serviceId,
      appointmentDate,
      duration: service.duration, // Service duration
      status: 'PENDING',
      confirmationToken
    }
  });

  return booking;
}

/**
 * Get booking details by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  return prisma.booking.findUnique({
    where: { id }
  });
}

/**
 * Get booking by confirmation token
 * Used when patient clicks email link to confirm booking
 */
export async function getBookingByToken(token: string): Promise<Booking | null> {
  return prisma.booking.findUnique({
    where: { confirmationToken: token }
  });
}

/**
 * Update booking status
 *
 * ALLOWED TRANSITIONS:
 * - PENDING → CONFIRMED (patient confirms)
 * - PENDING/CONFIRMED → CANCELLED (doctor/patient cancels)
 * - CONFIRMED → COMPLETED (after appointment)
 * - CONFIRMED → NO_SHOW (patient didn't show up)
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  doctorId?: string // If provided, verify doctor owns this booking
): Promise<Booking> {
  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id }
  });

  if (!booking) throw new Error('Booking not found');

  // If doctorId provided, verify doctor owns this booking
  if (doctorId && booking.doctorId !== doctorId) {
    throw new Error('Unauthorized: Doctor does not own this booking');
  }

  // Update status
  const updated = await prisma.booking.update({
    where: { id },
    data: { status }
  });

  return updated;
}

/**
 * Get all bookings for a doctor (for admin dashboard)
 */
export async function getDoctorBookings(
  doctorId: string,
  filters?: {
    status?: BookingStatus;
    fromDate?: Date;
    toDate?: Date;
  }
): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: {
      doctorId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.fromDate && {
        appointmentDate: {
          gte: filters.fromDate
        }
      }),
      ...(filters?.toDate && {
        appointmentDate: {
          lte: filters.toDate
        }
      })
    },
    orderBy: { appointmentDate: 'asc' }
  });
}

/**
 * Get today's bookings for a doctor
 */
export async function getTodayBookings(doctorId: string): Promise<Booking[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getDoctorBookings(doctorId, {
    fromDate: today,
    toDate: tomorrow
  });
}

/**
 * Get this week's bookings for a doctor
 */
export async function getWeekBookings(doctorId: string): Promise<Booking[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return getDoctorBookings(doctorId, {
    fromDate: today,
    toDate: nextWeek
  });
}
