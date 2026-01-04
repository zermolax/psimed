import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';
import { verifyPassword } from '$lib/server/utils/password';
import { setSession } from '$lib/server/middleware/auth';
import { loginSchema } from '$lib/server/validators/booking.validator';

// Don't prerender this page (has server actions)
export const prerender = false;

/**
 * EXPLANATION: Server Actions in SvelteKit
 *
 * This file (+page.server.ts) runs ONLY on the server.
 * The "default" action below is called when the form is submitted.
 *
 * FLOW:
 * 1. Form submits POST to this route
 * 2. default() action runs
 * 3. Gets email/password from form data
 * 4. Validates with Zod
 * 5. Finds doctor in database
 * 6. Compares password with bcrypt
 * 7. Sets session cookie
 * 8. Redirects to /admin
 */

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    // Get form data from request
    const formData = await request.formData();
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    // Validate input with Zod
    try {
      loginSchema.parse({ email, password });
    } catch (error: any) {
      // Return validation error to form
      return fail(400, {
        error: 'Email and password are required',
      });
    }

    // Find doctor in database by email
    const doctor = await prisma.doctor.findUnique({
      where: { email: email! },
    });

    // If doctor doesn't exist or inactive
    if (!doctor || !doctor.isActive) {
      return fail(401, {
        error: 'Invalid email or password',
      });
    }

    // Compare submitted password with hashed password in DB
    const isPasswordValid = await verifyPassword(password!, doctor.passwordHash);

    if (!isPasswordValid) {
      return fail(401, {
        error: 'Invalid email or password',
      });
    }

    // ✅ Login successful! Set session cookie
    setSession(
      cookies,
      {
        doctorId: doctor.id,
        email: doctor.email,
        name: doctor.name,
      },
      process.env.NODE_ENV === 'production'
    );

    // Redirect to admin dashboard
    throw redirect(303, '/admin');
  },
};
