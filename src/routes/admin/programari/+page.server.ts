import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

/**
 * EXPLANATION: Admin Bookings Page Server Load
 *
 * This page fetches all bookings for the logged-in doctor.
 * It runs on the server ONLY, so it has access to the session.
 */

export const load: PageServerLoad = async ({ cookies }) => {
  // Get session from cookie
  const sessionCookie = cookies.get('doctor_session');

  if (!sessionCookie) {
    throw redirect(303, '/admin/login');
  }

  let session;
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    throw redirect(303, '/admin/login');
  }

  const doctorId = session.doctorId;

  // Get doctor
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      name: true,
      email: true,
      speciality: true
    }
  });

  if (!doctor) {
    throw redirect(303, '/admin/login');
  }

  // Get all bookings for this doctor (sorted by date descending - newest first)
  const bookings = await prisma.booking.findMany({
    where: { doctorId },
    include: {
      service: {
        select: {
          name: true,
          duration: true,
          price: true
        }
      }
    },
    orderBy: { appointmentDate: 'desc' }
  });

  // Get stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() + 7);

  const todayBookings = await prisma.booking.count({
    where: {
      doctorId,
      appointmentDate: {
        gte: today,
        lt: tomorrow
      },
      status: { not: 'CANCELLED' }
    }
  });

  const weekBookings = await prisma.booking.count({
    where: {
      doctorId,
      appointmentDate: {
        gte: today,
        lt: thisWeek
      },
      status: { not: 'CANCELLED' }
    }
  });

  const monthBookings = await prisma.booking.count({
    where: {
      doctorId,
      appointmentDate: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1),
        lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      },
      status: { not: 'CANCELLED' }
    }
  });

  return {
    doctor,
    bookings,
    stats: {
      today: todayBookings,
      week: weekBookings,
      month: monthBookings
    }
  };
};
