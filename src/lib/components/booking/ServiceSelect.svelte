<script lang="ts">
  import type { Service } from '$lib/types/booking';

  /**
   * EXPLANATION: ServiceSelect Component
   *
   * This component:
   * 1. Receives list of services from parent (already fetched for selected doctor)
   * 2. Displays services as a selectable list
   * 3. Shows price and duration for each service
   * 4. Uses Svelte 5 $state() for reactive selection
   * 5. Notifies parent when service is selected
   */

  interface Props {
    services: Service[];
    selectedServiceId?: string;
    onSelect: (serviceId: string, service: Service) => void;
  }

  let { services, selectedServiceId, onSelect }: Props = $props();

  /**
   * Handle service selection
   */
  function handleSelect(service: Service) {
    selectedServiceId = service.id;
    onSelect(service.id, service);
  }

  /**
   * Format duration nicely
   * EXAMPLE: 1 → "1 oră", 1.5 → "1.5 ore"
   */
  function formatDuration(hours: number): string {
    if (hours === 1) return '1 oră';
    return `${hours} ore`;
  }

  /**
   * Format price as currency
   * EXAMPLE: 150 → "150 RON"
   */
  function formatPrice(price: number): string {
    return `${price} RON`;
  }
</script>

<div class="service-select">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Selectează Serviciu</h2>

  {#if services.length === 0}
    <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
      <p>Doctorul selectat nu are servicii disponibile.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each services as service (service.id)}
        <button
          type="button"
          on:click={() => handleSelect(service)}
          class="service-item w-full p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md"
          class:selected={selectedServiceId === service.id}
        >
          <div class="flex items-start justify-between">
            <div class="flex-grow">
              <!-- Service Name -->
              <h3 class="font-bold text-gray-900">{service.name}</h3>

              <!-- Service Description -->
              {#if service.description}
                <p class="text-sm text-gray-600 mt-1">{service.description}</p>
              {/if}

              <!-- Duration and Price -->
              <div class="flex gap-4 mt-2 text-sm text-gray-500">
                <span>
                  <strong>Durată:</strong>
                  {formatDuration(service.duration)}
                </span>
                <span>
                  <strong>Preț:</strong>
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>

            <!-- Selection Indicator -->
            {#if selectedServiceId === service.id}
              <div class="flex-shrink-0 text-primary ml-4">
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
  .service-item {
    border-color: #e5e7eb;
    background: white;
  }

  .service-item:hover {
    border-color: #d1d5db;
  }

  .service-item.selected {
    border-color: var(--color-primary, #dd4444);
    background: rgba(221, 68, 68, 0.05);
  }
</style>
