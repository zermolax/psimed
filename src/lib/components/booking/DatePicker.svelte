<script lang="ts">
  /**
   * EXPLANATION: DatePicker Component
   *
   * This component:
   * 1. Provides a simple date picker (using HTML input type="date")
   * 2. Disables past dates (before today)
   * 3. Returns date in YYYY-MM-DD format
   * 4. Notifies parent when date is selected
   *
   * NOTE: For MVP, we use native HTML date picker
   * In future, can replace with calendar widget library (e.g., `date-fns`, `dayjs`)
   *
   * SVELTE 5 PATTERN: Using $state() for reactive date tracking
   */

  interface Props {
    selectedDate?: string;
    onSelect: (date: string) => void;
  }

  let { selectedDate = '', onSelect }: Props = $props();

  /**
   * Get today's date in YYYY-MM-DD format
   * This is used as the minimum date in the date input
   */
  function getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Handle date selection
   * The value from input is already in YYYY-MM-DD format
   */
  function handleDateChange(value: string) {
    selectedDate = value;
    onSelect(value);
    console.log('📅 Date selected:', value);
  }
</script>

<div class="date-picker">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Selectează Data</h2>

  <div class="bg-white p-6 rounded-lg border border-gray-200">
    <label for="appointment-date" class="block text-sm font-medium text-gray-700 mb-3">
      Data Programării
    </label>

    <input
      id="appointment-date"
      type="date"
      value={selectedDate}
      on:change={(e) => handleDateChange(e.currentTarget.value)}
      min={getTodayString()}
      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      required
    />

    {#if selectedDate}
      <p class="mt-3 text-sm text-gray-600">
        📅 Data selectată: <strong>{new Date(selectedDate).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
      </p>
    {/if}
  </div>

  <!-- Helper text -->
  <p class="mt-4 text-xs text-gray-500">
    Puteți selecta doar date din viitor. Programările se pot face cu minim 24 de ore înainte.
  </p>
</div>

<style>
  /* Style date input appearance */
  input[type='date'] {
    font-size: 16px;
  }

  /* Remove default spinner on date input (optional) */
  input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.7;
  }
</style>
