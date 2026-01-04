import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession } from '$lib/server/middleware/auth';

/**
 * EXPLANATION: POST Request Handler
 *
 * This is an API endpoint (server-only, no HTML page)
 * When you POST to /admin/logout:
 * 1. This function runs
 * 2. Deletes the session cookie
 * 3. Redirects to login page
 *
 * We use POST (not GET) for security reasons:
 * - Prevents accidental logout from clicking a link
 * - Requires explicit form submission
 */

export const POST: RequestHandler = ({ cookies }) => {
  // Delete session cookie
  deleteSession(cookies);

  // Redirect to login page
  throw redirect(303, '/admin/login');
};
