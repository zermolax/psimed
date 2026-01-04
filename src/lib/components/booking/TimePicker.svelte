<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * EXPLANATION: TimePicker Component
   *
   * This component:
   * 1. Fetches available time slots from /api/availability
   * 2. Displays available times as clickable buttons
   * 3. Disables unavailable slots (already booked)
   * 4. Shows loading state while fetching
   * 5. Handles date/doctor/service changes by refetching slots
   *
   * REACTIVE DEPENDENCY: This component re-fetches when props change
   * Using Svelte's $effect() rune to automatically react to prop changes
   */

  interface Props {
    doctorId?: string;
    serviceId?: string;
    date?: string;
    selectedTime?: string;
    onSelect: (time: string) => void;
  }

  let { doctorId, serviceId, date, selectedTime = '', onSelect }: Props = $props();

  interface TimeSlot {
    time: string;
    available: boolean;
  }

  let slots = $state<TimeSlot[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  /**
   * SVELTE 5 PATTERN: $effect()
   * This runs whenever doctorId, serviceId, or date changes
   * Automatically fetches new availability
   */
  $effect(() => {
    if (doctorId && serviceId && date) {
      fetchSlots();
    }
  });

  /**
   * Fetch available time slots from API
   */
  async function fetchSlots() {
    loading = true;
    error = null;
    slots = [];

    try {
      const params = new URLSearchParams({
        doctorId: doctorId || '',
        serviceId: serviceId || '',
        date: date || ''
      });

      const response = await fetch(`/api/availability?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch availability');
      }

      const data = await response.json();
      slots = data.slots || [];

      console.log(`✅ Loaded ${slots.length} time slots`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error loading slots:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Handle time selection
   */
  function handleSelect(time: string) {
    selectedTime = time;
    onSelect(time);
    console.log('⏰ Time selected:', time);
  }

  /**
   * Get available slots count
   */
  let availableCount = $derived(slots.filter((s) => s.available).length);
</script>

<div class="time-picker">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Selectează Ora</h2>

  {#if !doctorId || !serviceId || !date}
    <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
      <p>Selectați mai întâi: doctor, serviciu și dată</p>
    </div>
  {:else if loading}
    <div class="text-center py-8">
      <p class="text-gray-600">Se încarcă orele disponibile...</p>
      <div class="animate-spin mt-4 h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p><strong>Eroare:</strong> {error}</p>
    </div>
  {:else if slots.length === 0}
    <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
      <p>Nu sunt ore disponibile pentru ziua selectată.</p>
    </div>
  {:else}
    <div>
      <!-- Info -->
      <p class="mb-4 text-sm text-gray-600">
        <strong>{availableCount}</strong> ora(e) disponibilă(e)
      </p>

      <!-- Time Slots Grid -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {#each slots as slot (slot.time)}
          <button
            type="button"
            on:click={() => handleSelect(slot.time)}
            disabled={!slot.available}
            class="time-slot px-3 py-2 border-2 rounded-lg transition-all duration-200 font-medium text-sm"
            class:available={slot.available}
            class:unavailable={!slot.available}
            class:selected={selectedTime === slot.time && slot.available}
          >
            {slot.time}
          </button>
        {/each}
      </div>

      <!-- Selected time display -->
      {#if selectedTime}
        <p class="mt-4 text-sm text-gray-600">
          ⏰ Ora selectată: <strong>{selectedTime}</strong>
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .time-slot {
    border-color: #e5e7eb;
    background: white;
    cursor: pointer;
  }

  .time-slot.available:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .time-slot.available:active {
    background: #f3f4f6;
  }

  .time-slot.selected {
    border-color: var(--color-primary, #dd4444);
    background: rgba(221, 68, 68, 0.1);
    color: var(--color-primary, #dd4444);
  }

  .time-slot.unavailable {
    border-color: #e5e7eb;
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .time-slot.unavailable:hover {
    border-color: #e5e7eb;
    background: #f3f4f6;
  }
</style>
