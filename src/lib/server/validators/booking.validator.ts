import { z } from 'zod';

/**
 * EXPLANATION: Data Validation with Zod
 *
 * Zod is a TypeScript-first schema builder. You define what data should look like,
 * and Zod automatically:
 * - Validates the data
 * - Gives you TypeScript types
 * - Provides helpful error messages
 *
 * Example:
 * const schema = z.object({
 *   name: z.string().min(3, 'Too short!')
 * });
 *
 * schema.parse({ name: 'Jo' }) // ❌ Error: "Too short!"
 * schema.parse({ name: 'John' }) // ✅ Success!
 */

// ============================================
// LOGIN VALIDATION
// ============================================
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(3, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// BOOKING VALIDATION
// ============================================
export const createBookingSchema = z.object({
  patientName: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),

  patientEmail: z
    .string('Email is required')
    .email('Invalid email address'),

  patientPhone: z
    .string('Phone is required')
    .regex(/^[\d\s\-\+()]+$/, 'Invalid phone number'),

  patientNotes: z
    .string()
    .max(1000, 'Notes too long')
    .optional(),

  doctorId: z
    .string('Doctor is required'),

  serviceId: z
    .string('Service is required'),

  date: z
    .string('Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  time: z
    .string('Time is required')
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ============================================
// UPDATE BOOKING STATUS VALIDATION
// ============================================
export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  cancellationReason: z
    .string()
    .max(500, 'Reason too long')
    .optional(),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
