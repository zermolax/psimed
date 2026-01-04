<script lang="ts">
  import { page } from '$app/stores';

  /**
   * EXPLANATION: Admin Bookings Page
   *
   * This page displays all bookings for the logged-in doctor.
   * Shows:
   * - Bookings table with filtering
   * - Status badges
   * - Action buttons (mark complete, cancel, etc.)
   */

  let selectedStatus = $state<string | null>(null);

  // Get data from server
  const doctor = $page.data.doctor;
  const allBookings = $page.data.bookings;
  const stats = $page.data.stats;

  // Filter bookings by status if selected
  let filteredBookings = $derived(
    selectedStatus
      ? allBookings.filter((b: any) => b.status === selectedStatus)
      : allBookings
  );

  /**
   * Get status badge styling
   */
  function getStatusBadgeClass(status: string): string {
    const baseClass = 'px-3 py-1 rounded-full text-sm font-semibold text-white';
    switch (status) {
      case 'CONFIRMED':
        return `${baseClass} bg-green-500`;
      case 'COMPLETED':
        return `${baseClass} bg-blue-500`;
      case 'CANCELLED':
        return `${baseClass} bg-red-500`;
      case 'NO_SHOW':
        return `${baseClass} bg-orange-500`;
      default:
        return `${baseClass} bg-gray-500`;
    }
  }

  /**
   * Get status label in Romanian
   */
  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      CONFIRMED: 'Confirmat',
      COMPLETED: 'Completat',
      CANCELLED: 'Anulat',
      NO_SHOW: 'Nu s-a prezentat',
      PENDING: 'În așteptare'
    };
    return labels[status] || status;
  }

  /**
   * Format date and time
   */
  function formatDateTime(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('ro-RO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format price
   */
  function formatPrice(price: any): string {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `${num.toFixed(2)} RON`;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 py-6 px-4">
    <div class="container-custom max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-900">Programările Mele</h1>
      <p class="text-gray-600 mt-1">Dr. {doctor.name}</p>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="container-custom max-w-6xl py-8 px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 text-sm mb-2">Astazi</p>
        <p class="text-4xl font-bold text-primary">{stats.today}</p>
        <p class="text-gray-500 text-xs mt-2">Programari in curs</p>
      </div>

      <!-- This Week -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 text-sm mb-2">Aceasta saptamana</p>
        <p class="text-4xl font-bold text-secondary">{stats.week}</p>
        <p class="text-gray-500 text-xs mt-2">Total programari</p>
      </div>

      <!-- This Month -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 text-sm mb-2">Aceasta luna</p>
        <p class="text-4xl font-bold text-accent">{stats.month}</p>
        <p class="text-gray-500 text-xs mt-2">Total programari</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filtreaza dupa status</h2>
      <div class="flex flex-wrap gap-2">
        <button
          on:click={() => (selectedStatus = null)}
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          class:bg-primary={selectedStatus === null}
          class:text-white={selectedStatus === null}
          class:bg-gray-200={selectedStatus !== null}
          class:text-gray-700={selectedStatus !== null}
        >
          Toate ({allBookings.length})
        </button>

        <button
          on:click={() => (selectedStatus = 'CONFIRMED')}
          class="px-4 py-2 rounded-lg font-medium transition-colors bg-green-100 text-green-800"
          class:bg-green-500={selectedStatus === 'CONFIRMED'}
          class:text-white={selectedStatus === 'CONFIRMED'}
        >
          Confirmate ({allBookings.filter((b: any) => b.status === 'CONFIRMED').length})
        </button>

        <button
          on:click={() => (selectedStatus = 'COMPLETED')}
          class="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-100 text-blue-800"
          class:bg-blue-500={selectedStatus === 'COMPLETED'}
          class:text-white={selectedStatus === 'COMPLETED'}
        >
          Completate ({allBookings.filter((b: any) => b.status === 'COMPLETED').length})
        </button>

        <button
          on:click={() => (selectedStatus = 'CANCELLED')}
          class="px-4 py-2 rounded-lg font-medium transition-colors bg-red-100 text-red-800"
          class:bg-red-500={selectedStatus === 'CANCELLED'}
          class:text-white={selectedStatus === 'CANCELLED'}
        >
          Anulate ({allBookings.filter((b: any) => b.status === 'CANCELLED').length})
        </button>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      {#if filteredBookings.length === 0}
        <div class="p-8 text-center">
          <p class="text-gray-600">Nu exista programari cu acest filtru.</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data si Ora</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pacient</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Serviciu</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pret</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actiuni</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each filteredBookings as booking (booking.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {formatDateTime(booking.appointmentDate)}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{booking.patientName}</div>
                    <div class="text-xs text-gray-500">{booking.patientEmail}</div>
                    <div class="text-xs text-gray-500">{booking.patientPhone}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{booking.service.name}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{formatPrice(booking.service.price)}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class={getStatusBadgeClass(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <button
                      class="text-primary hover:underline"
                      title="Vezi detalii"
                    >
                      Detalii
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: white;
  }
</style>
