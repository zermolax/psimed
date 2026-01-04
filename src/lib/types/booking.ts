/**
 * EXPLANATION: TypeScript Types for Booking System
 *
 * These types define the structure of data used throughout the booking system.
 * They are exported from API endpoints and used by components.
 *
 * BENEFITS:
 * - Type safety: Catch errors at compile time
 * - Intellisense: IDE shows available properties
 * - Self-documenting: Types serve as documentation
 */

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in hours (1, 1.5, 2, etc)
  price: number; // in RON
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  phone: string;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "17:00"
  services: Service[];
  isActive?: boolean;
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}

export interface Booking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes?: string;
  doctorId: string;
  serviceId: string;
  appointmentDate: Date;
  duration: number;
  status: BookingStatus;
  confirmationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface BookingRequest {
  doctorId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes?: string;
}
