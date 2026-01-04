<script lang="ts">
  import type { Doctor, Service } from '$lib/types/booking';

  /**
   * EXPLANATION: BookingSummary Component
   *
   * This component:
   * 1. Displays summary of all selected information
   * 2. Shows doctor, service, date/time, patient info
   * 3. Provides "Confirm" button to submit booking
   * 4. Shows loading state while submitting
   * 5. Handles API response and errors
   */

  interface BookingData {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNotes?: string;
  }

  interface Props {
    doctor: Doctor;
    service: Service;
    date: string;
    time: string;
    patientInfo: BookingData;
    onConfirm: (bookingId: string) => void;
  }

  let { doctor, service, date, time, patientInfo, onConfirm }: Props = $props();

  let submitting = $state(false);
  let error = $state<string | null>(null);

  /**
   * Handle booking confirmation
   * Sends POST request to /api/bookings
   */
  async function handleConfirm() {
    submitting = true;
    error = null;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          serviceId: service.id,
          date,
          time,
          ...patientInfo
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();
      console.log('✅ Booking created:', data.booking.id);

      // Call parent callback with confirmation token (for public access)
      onConfirm(data.booking.confirmationToken);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error creating booking:', err);
    } finally {
      submitting = false;
    }
  }

  /**
   * Format date nicely
   */
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format duration
   */
  function formatDuration(hours: number): string {
    if (hours === 1) return '1 oră';
    return `${hours} ore`;
  }
</script>

<div class="booking-summary">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Confirmă Programarea</h2>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <p><strong>Eroare:</strong> {error}</p>
    </div>
  {/if}

  <!-- Summary Boxes -->
  <div class="space-y-4 mb-6">
    <!-- Doctor Summary -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <p class="text-sm text-gray-600 mb-1">
        <strong>Doctor</strong>
      </p>
      <p class="text-lg font-semibold text-gray-900">{doctor.name}</p>
      <p class="text-sm text-gray-600">{doctor.speciality}</p>
    </div>

    <!-- Service Summary -->
    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
      <p class="text-sm text-gray-600 mb-1">
        <strong>Serviciu</strong>
      </p>
      <p class="text-lg font-semibold text-gray-900">{service.name}</p>
      <div class="flex gap-4 mt-2 text-sm text-gray-600">
        <span>Durată: {formatDuration(service.duration)}</span>
        <span>Preț: {service.price} RON</span>
      </div>
    </div>

    <!-- Appointment Summary -->
    <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
      <p class="text-sm text-gray-600 mb-1">
        <strong>Data și Ora</strong>
      </p>
      <p class="text-lg font-semibold text-gray-900">
        {formatDate(date)} la {time}
      </p>
    </div>

    <!-- Patient Info Summary -->
    <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
      <p class="text-sm text-gray-600 mb-3">
        <strong>Informații Pacient</strong>
      </p>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Nume:</span>
          <span class="font-semibold text-gray-900">{patientInfo.patientName}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Email:</span>
          <span class="font-semibold text-gray-900">{patientInfo.patientEmail}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Telefon:</span>
          <span class="font-semibold text-gray-900">{patientInfo.patientPhone}</span>
        </div>
        {#if patientInfo.patientNotes}
          <div>
            <span class="text-gray-600">Note:</span>
            <p class="mt-1 text-gray-700 bg-white p-2 rounded border border-gray-200">
              {patientInfo.patientNotes}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Confirm Button -->
  <button
    on:click={handleConfirm}
    disabled={submitting}
    class="w-full py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {#if submitting}
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Se creează programarea...
    {:else}
      Confirmă Programarea
    {/if}
  </button>

  <!-- Info text -->
  <p class="mt-4 text-xs text-gray-500 text-center">
    Veți primi un email de confirmare pe adresa {patientInfo.patientEmail}
  </p>
</div>

<style>
  .booking-summary {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
