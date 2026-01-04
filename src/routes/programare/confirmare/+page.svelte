<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  /**
   * EXPLANATION: Booking Confirmation Page
   *
   * This page is shown after successful booking.
   * It displays:
   * - Success message
   * - Booking details
   * - Confirmation token
   * - Next steps
   *
   * Query parameter: ?bookingId=xxx
   */

  interface BookingDetails {
    id: string;
    patientName: string;
    patientEmail: string;
    appointmentDate: string;
    status: string;
    confirmationToken: string;
  }

  let booking = $state<BookingDetails | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    const token = $page.url.searchParams.get('token');

    if (!token) {
      error = 'No confirmation token provided';
      loading = false;
      return;
    }

    try {
      // Use a dummy ID with token parameter for public booking lookup
      const response = await fetch(`/api/bookings/public?token=${encodeURIComponent(token)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      booking = data;
      console.log('✅ Booking loaded:', booking);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load booking';
      console.error('❌ Error loading booking:', err);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Confirmarea Programării - Clinica SF. Gherasim</title>
</svelte:head>

<!-- Success Section -->
<section class="section-spacing bg-gradient-to-br from-green-50 to-green-100">
  <div class="container-custom max-w-2xl">
    {#if loading}
      <div class="text-center">
        <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p class="text-gray-600">Se încarcă datele programării...</p>
      </div>
    {:else if error}
      <div class="text-center">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-3xl font-bold text-red-900 mb-4">Eroare</h1>
        <p class="text-red-700">{error}</p>
        <a href="/programare" class="mt-6 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
          ← Înapoi la programare
        </a>
      </div>
    {:else if booking}
      <!-- Success Icon -->
      <div class="text-center mb-8">
        <div class="inline-block">
          <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Programarea a fost creată cu succes!</h1>
        <p class="text-lg text-gray-600">Veți primi o confirmare prin email</p>
      </div>

      <!-- Booking Details Card -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Detaliile Programării</h2>

        <div class="space-y-4">
          <!-- Booking ID -->
          <div class="border-b border-gray-200 pb-4">
            <p class="text-sm text-gray-600 mb-1">
              <strong>ID Programare:</strong>
            </p>
            <p class="text-lg font-mono text-gray-900 break-all">{booking.id}</p>
          </div>

          <!-- Patient Name -->
          <div class="border-b border-gray-200 pb-4">
            <p class="text-sm text-gray-600 mb-1">
              <strong>Pacient:</strong>
            </p>
            <p class="text-lg text-gray-900">{booking.patientName}</p>
          </div>

          <!-- Email -->
          <div class="border-b border-gray-200 pb-4">
            <p class="text-sm text-gray-600 mb-1">
              <strong>Email:</strong>
            </p>
            <p class="text-lg text-gray-900">{booking.patientEmail}</p>
          </div>

          <!-- Appointment Date and Time -->
          <div class="border-b border-gray-200 pb-4">
            <p class="text-sm text-gray-600 mb-1">
              <strong>Data și Ora Programării:</strong>
            </p>
            <p class="text-lg text-gray-900">
              {formatDate(booking.appointmentDate)} la {formatTime(booking.appointmentDate)}
            </p>
          </div>

          <!-- Confirmation Token -->
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p class="text-sm text-gray-600 mb-1">
              <strong>Cod de Confirmare:</strong>
            </p>
            <p class="text-xl font-bold text-blue-600 font-mono">{booking.confirmationToken}</p>
            <p class="text-xs text-gray-600 mt-2">Salvați acest cod - vă va trebui dacă doriți să anulați programarea</p>
          </div>

          <!-- Status -->
          <div>
            <p class="text-sm text-gray-600 mb-1">
              <strong>Status:</strong>
            </p>
            <div class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {booking.status === 'PENDING' ? '⏳ În așteptare de confirmare' : booking.status}
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🎯 Pași Următori</h2>
        <ol class="space-y-4">
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
            <div>
              <p class="font-semibold text-gray-900">Verificați email-ul</p>
              <p class="text-sm text-gray-600 mt-1">Veți primi o confirmare pe adresa {booking.patientEmail}</p>
            </div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
            <div>
              <p class="font-semibold text-gray-900">Pregătiți documentele</p>
              <p class="text-sm text-gray-600 mt-1">Aduceți actul de identitate și cardurile de sănătate relevante</p>
            </div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
            <div>
              <p class="font-semibold text-gray-900">Veniți 10-15 minute mai devreme</p>
              <p class="text-sm text-gray-600 mt-1">Aceasta permite administratiei să vă completeze formularele</p>
            </div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
            <div>
              <p class="font-semibold text-gray-900">Contactați-ne cu întrebări</p>
              <p class="text-sm text-gray-600 mt-1">Telefon: +40 711 039 666 | Email: office@psimed.ro</p>
            </div>
          </li>
        </ol>
      </div>

      <!-- Important Info -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-4">⚠️ Informații Importante</h3>
        <ul class="space-y-2 text-sm text-gray-700">
          <li>✓ <strong>Anulări/Reprogramări:</strong> Cu minimum 24 de ore înainte de programare</li>
          <li>✓ <strong>Locația:</strong> Clinica SF. Gherasim, [Adresa]</li>
          <li>✓ <strong>Parcare:</strong> Disponibilă gratuit în zona clinicii</li>
          <li>✓ <strong>Asigurare:</strong> Suntem parteneri cu principalele asigurări medicale</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mt-8">
        <a
          href="/"
          class="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-center"
        >
          ← Înapoi la Acasă
        </a>
        <a
          href="/programare"
          class="flex-1 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
        >
          Noua Programare
        </a>
      </div>
    {/if}
  </div>
</section>

<!-- FAQ Section -->
<section class="section-spacing bg-white">
  <div class="container-custom max-w-3xl">
    <h2 class="text-3xl font-bold text-center mb-12">Întrebări Frecvente</h2>

    <div class="space-y-6">
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Cum anlez programarea?</h3>
        <p class="text-gray-600">Sunați-ne la +40 711 039 666 sau trimiteți un email la office@psimed.ro cu codul de confirmare.</p>
      </div>

      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Voi primesc o confirmare suplimentară?</h3>
        <p class="text-gray-600">Da, vă vom contacta telefonic cu 24 de ore înainte de programare pentru a confirma participarea.</p>
      </div>

      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Am pierdut emailul de confirmare. Ce fac?</h3>
        <p class="text-gray-600">Contactați-ne la office@psimed.ro cu codul de confirmare de mai sus.</p>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Pot reschedula programarea?</h3>
        <p class="text-gray-600">Da, puteți reschedula cu minimum 24 de ore înainte. Contactați-ne telefonic sau prin email.</p>
      </div>
    </div>
  </div>
</section>

<style>
  :global(body) {
    background: white;
  }
</style>
