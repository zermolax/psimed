import { prisma } from '$lib/server/db';
import { Resend } from 'resend';
import type { Booking } from '@prisma/client';

/**
 * EXPLANATION: Notification Service
 *
 * Sends emails to patients and doctors using Resend API.
 * Resend is a transactional email service (like SendGrid, AWS SES).
 *
 * FREE TIER: 100 emails/day
 * COST: €0 for MVP, €20/month for 50k emails if scales
 *
 * DOCUMENTATION: https://resend.com/nodejs
 */

// Initialize Resend client
// NOTE: If RESEND_API_KEY is not set, emails will be logged to console instead
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_get_from_resend'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Send booking confirmation email to patient
 *
 * This email is sent immediately after booking is created.
 * Contains:
 * - Booking details (date, time, service, doctor)
 * - Confirmation link (for future confirmation if needed)
 * - Clinic contact info
 */
export async function sendBookingConfirmation(booking: Booking, doctorName: string, serviceName: string): Promise<void> {
  // Format date and time nicely
  const appointmentDate = booking.appointmentDate.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const appointmentTime = booking.appointmentDate.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dd4444 0%, #9370db 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .booking-details { background: white; padding: 15px; border-left: 4px solid #dd4444; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dd4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmare Programare</h1>
            <p>Clinica SF. Gherasim</p>
          </div>

          <div class="content">
            <p>Bună <strong>${booking.patientName}</strong>,</p>

            <p>Programarea ta a fost creată cu succes! Iată detaliile:</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Doctor:</span>
                <span class="detail-value">${doctorName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Serviciu:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value">${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ora:</span>
                <span class="detail-value">${appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Cod Confirmare:</span>
                <span class="detail-value">${booking.confirmationToken}</span>
              </div>
            </div>

            <p><strong>Notă importantă:</strong> Vă rugăm să sunați clinica cu 24 de ore înainte dacă trebuie să anulați programarea.</p>

            <p>Telefon clinic: +40 XXX XXX XXXX</p>
            <p>Email: contact@clinicasfgherasim.ro</p>

            <p>Cu plăcere,<br><strong>Echipa Clinicii SF. Gherasim</strong></p>
          </div>

          <div class="footer">
            <p>Acest email a fost generat automat. Nu răspundeți la acest email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log(`📧 Sending confirmation email to ${booking.patientEmail}...`);

    // If Resend API key is not configured, just log to console
    if (!resend) {
      console.log(`⚠️  Resend API not configured. Email would be sent to: ${booking.patientEmail}`);
      console.log(`📧 Subject: Confirmare Programare - ${appointmentDate}`);
      return;
    }

    await resend.emails.send({
      from: 'noreply@clinicasfgherasim.ro', // Change to your domain
      to: booking.patientEmail,
      subject: `Confirmare Programare - ${appointmentDate}`,
      html: htmlContent
    });

    console.log(`✅ Email sent successfully to ${booking.patientEmail}`);

    // Log notification in database
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMATION',
        channel: 'EMAIL',
        recipient: booking.patientEmail,
        subject: `Confirmare Programare - ${appointmentDate}`,
        message: htmlContent,
        status: 'SENT',
        sentAt: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Failed to send email:', error);

    // Log failed notification in database
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMATION',
        channel: 'EMAIL',
        recipient: booking.patientEmail,
        subject: `Confirmare Programare - ${appointmentDate}`,
        message: htmlContent,
        status: 'FAILED',
        sentAt: new Date()
      }
    });

    throw error;
  }
}

/**
 * Send notification email to doctor about new booking
 *
 * This email alerts the doctor that a new patient booking was created.
 */
export async function sendDoctorNotification(
  booking: Booking,
  doctorEmail: string,
  doctorName: string,
  serviceName: string
): Promise<void> {
  const appointmentDate = booking.appointmentDate.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const appointmentTime = booking.appointmentDate.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2ba89b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .booking-details { background: white; padding: 15px; border-left: 4px solid #2ba89b; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Programare Nouă</h1>
          </div>

          <div class="content">
            <p>Bună Dr. <strong>${doctorName}</strong>,</p>

            <p>Ai o nouă programare în sistem:</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Pacient:</span>
                <span class="detail-value">${booking.patientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Serviciu:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value">${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ora:</span>
                <span class="detail-value">${appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Telefon Pacient:</span>
                <span class="detail-value">${booking.patientPhone}</span>
              </div>
            </div>

            ${booking.patientNotes ? `<p><strong>Note Pacient:</strong><br>${booking.patientNotes}</p>` : ''}

            <p><a href="http://localhost:3000/admin/programari" style="background: #2ba89b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Vezi în Dashboard</a></p>
          </div>

          <div class="footer">
            <p>Acest email a fost generat automat.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log(`📧 Sending notification email to doctor ${doctorEmail}...`);

    // If Resend API key is not configured, just log to console
    if (!resend) {
      console.log(`⚠️  Resend API not configured. Email would be sent to: ${doctorEmail}`);
      console.log(`📧 Subject: Programare Nouă - ${booking.patientName}`);
      return;
    }

    await resend.emails.send({
      from: 'noreply@clinicasfgherasim.ro',
      to: doctorEmail,
      subject: `Programare Nouă - ${booking.patientName}`,
      html: htmlContent
    });

    console.log(`✅ Doctor notification sent to ${doctorEmail}`);

    // Log notification
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMATION',
        channel: 'EMAIL',
        recipient: doctorEmail,
        subject: `Programare Nouă - ${booking.patientName}`,
        message: htmlContent,
        status: 'SENT',
        sentAt: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Failed to send doctor notification:', error);

    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMATION',
        channel: 'EMAIL',
        recipient: doctorEmail,
        subject: `Programare Nouă - ${booking.patientName}`,
        message: htmlContent,
        status: 'FAILED',
        sentAt: new Date()
      }
    });

    throw error;
  }
}

/**
 * Send cancellation email to patient
 */
export async function sendCancellationEmail(
  booking: Booking,
  doctorName: string,
  serviceName: string,
  reason?: string
): Promise<void> {
  const appointmentDate = booking.appointmentDate.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dd4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Anulare Programare</h1>
          </div>

          <div class="content">
            <p>Bună <strong>${booking.patientName}</strong>,</p>

            <p>Programarea ta pentru <strong>${appointmentDate}</strong> cu Dr. <strong>${doctorName}</strong> a fost anulată.</p>

            ${reason ? `<p><strong>Motiv:</strong> ${reason}</p>` : ''}

            <p>Dacă ai întrebări, te rugăm să ne contactezi la:</p>
            <p>Telefon: +40 XXX XXX XXXX<br>Email: contact@clinicasfgherasim.ro</p>

            <p>Cu plăcere,<br><strong>Echipa Clinicii SF. Gherasim</strong></p>
          </div>

          <div class="footer">
            <p>Acest email a fost generat automat.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log(`📧 Sending cancellation email to ${booking.patientEmail}...`);

    // If Resend API key is not configured, just log to console
    if (!resend) {
      console.log(`⚠️  Resend API not configured. Email would be sent to: ${booking.patientEmail}`);
      console.log(`📧 Subject: Anulare Programare`);
      return;
    }

    await resend.emails.send({
      from: 'noreply@clinicasfgherasim.ro',
      to: booking.patientEmail,
      subject: 'Anulare Programare',
      html: htmlContent
    });

    console.log(`✅ Cancellation email sent to ${booking.patientEmail}`);

    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'CANCELLATION',
        channel: 'EMAIL',
        recipient: booking.patientEmail,
        subject: 'Anulare Programare',
        message: htmlContent,
        status: 'SENT',
        sentAt: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error);
    throw error;
  }
}
