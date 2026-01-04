<script lang="ts">
  import { onMount } from 'svelte';
  import type { Doctor } from '$lib/types/booking';

  /**
   * EXPLANATION: DoctorSelect Component
   *
   * This component:
   * 1. Fetches list of all doctors from /api/doctors
   * 2. Displays them as cards with speciality and photo
   * 3. Allows user to select one
   * 4. Uses Svelte 5 $state() for reactive selection
   * 5. Calls parent onSelect callback when doctor is selected
   *
   * PATTERN: Parent-child communication
   * - Child component accepts props from parent
   * - Child updates local state
   * - Child calls callback to notify parent of change
   */

  interface Props {
    selectedDoctorId?: string;
    onSelect: (doctorId: string, doctor: Doctor) => void;
  }

  let { selectedDoctorId, onSelect }: Props = $props();

  let doctors = $state<Doctor[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  /**
   * Fetch doctors from API on component mount
   * onMount runs only on client-side (not during SSR)
   */
  onMount(async () => {
    try {
      const response = await fetch('/api/doctors');

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      doctors = await response.json();
      console.log('✅ Loaded doctors:', doctors.length);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error loading doctors:', err);
    } finally {
      loading = false;
    }
  });

  /**
   * Handle doctor selection
   * Called when user clicks a doctor card
   */
  function handleSelect(doctor: Doctor) {
    selectedDoctorId = doctor.id;
    onSelect(doctor.id, doctor);
  }
</script>

<div class="doctor-select">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Selectează Doctor</h2>

  {#if loading}
    <div class="text-center py-8">
      <p class="text-gray-600">Se încarcă doctori...</p>
      <div class="animate-spin mt-4 h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p><strong>Eroare:</strong> {error}</p>
    </div>
  {:else if doctors.length === 0}
    <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
      <p>Nu sunt doctori disponibili în acest moment.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each doctors as doctor (doctor.id)}
        <button
          type="button"
          on:click={() => handleSelect(doctor)}
          class="doctor-card p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md"
          class:selected={selectedDoctorId === doctor.id}
        >
          <div class="flex items-start gap-4">
            <!-- Doctor Avatar -->
            <div class="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              {doctor.name.charAt(0)}
            </div>

            <!-- Doctor Info -->
            <div class="flex-grow text-left">
              <h3 class="font-bold text-gray-900">{doctor.name}</h3>
              <p class="text-sm text-gray-600">{doctor.speciality}</p>
              <p class="text-xs text-gray-500 mt-1">{doctor.phone}</p>

              <!-- Services Count -->
              {#if doctor.services && doctor.services.length > 0}
                <p class="text-xs text-gray-500 mt-2">
                  <strong>{doctor.services.length}</strong> serviciu(ri)
                </p>
              {/if}
            </div>

            <!-- Selection Indicator -->
            {#if selectedDoctorId === doctor.id}
              <div class="flex-shrink-0 text-primary">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .doctor-card {
    border-color: #e5e7eb;
    background: white;
  }

  .doctor-card:hover {
    border-color: #d1d5db;
  }

  .doctor-card.selected {
    border-color: var(--color-primary, #dd4444);
    background: rgba(221, 68, 68, 0.05);
  }
</style>
