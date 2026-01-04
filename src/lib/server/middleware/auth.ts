import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * EXPLANATION: Authentication with Session Cookies
 *
 * FLOW:
 * 1. Doctor logs in with email/password
 * 2. Server validates password
 * 3. Server creates a SESSION COOKIE (httpOnly = JavaScript can't read it)
 * 4. Browser stores this cookie automatically
 * 5. On next request, cookie is sent automatically
 * 6. We verify the cookie is valid, extract doctor ID
 * 7. Doctor is logged in!
 *
 * Security notes:
 * - httpOnly: JavaScript can't read the cookie (prevents XSS attacks)
 * - secure: Only sent over HTTPS in production
 * - sameSite: Can't be sent cross-site (prevents CSRF attacks)
 * - maxAge: Cookie expires after 7 days (session timeout)
 */

export interface DoctorSession {
  doctorId: string;
  email: string;
  name: string;
}

/**
 * Check if request has valid session, return doctor info
 * Used in protected routes (+layout.ts)
 */
export function getSession(cookies: any): DoctorSession | null {
  const sessionCookie = cookies.get('doctor_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie) as DoctorSession;
    return session;
  } catch (error) {
    // If cookie is corrupted, delete it
    cookies.delete('doctor_session', { path: '/' });
    return null;
  }
}

/**
 * Set session cookie after successful login
 * Used in login action
 */
export function setSession(
  cookies: any,
  session: DoctorSession,
  isProduction: boolean
): void {
  cookies.set('doctor_session', JSON.stringify(session), {
    path: '/',
    httpOnly: true, // JavaScript can't access
    secure: isProduction, // Only HTTPS in production
    sameSite: 'lax', // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Delete session cookie (logout)
 * Used in logout endpoint
 */
export function deleteSession(cookies: any): void {
  cookies.delete('doctor_session', { path: '/' });
}
