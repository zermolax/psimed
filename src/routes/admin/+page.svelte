<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div>
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Stats Cards -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600 text-sm font-medium">Today's Appointments</p>
      <p class="text-4xl font-bold text-blue-600 mt-2">0</p>
      <p class="text-gray-500 text-xs mt-1">No appointments scheduled</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600 text-sm font-medium">This Week</p>
      <p class="text-4xl font-bold text-green-600 mt-2">0</p>
      <p class="text-gray-500 text-xs mt-1">Total appointments</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600 text-sm font-medium">This Month</p>
      <p class="text-4xl font-bold text-purple-600 mt-2">0</p>
      <p class="text-gray-500 text-xs mt-1">Total appointments</p>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
    <div class="space-y-2">
      <a href="/admin/programari" class="block text-blue-600 hover:underline">
        → View all bookings
      </a>
      <a href="/programare" class="block text-blue-600 hover:underline">
        → Share booking link with patients
      </a>
    </div>
  </div>
</div>
