<script lang="ts">
  import { goto } from '$app/navigation';
  import DoctorSelect from '$lib/components/booking/DoctorSelect.svelte';
  import ServiceSelect from '$lib/components/booking/ServiceSelect.svelte';
  import DatePicker from '$lib/components/booking/DatePicker.svelte';
  import TimePicker from '$lib/components/booking/TimePicker.svelte';
  import PatientInfoForm from '$lib/components/booking/PatientInfoForm.svelte';
  import BookingSummary from '$lib/components/booking/BookingSummary.svelte';
  import type { Doctor, Service } from '$lib/types/booking';

  /**
   * EXPLANATION: Booking Page (+page.svelte)
   *
   * This page orchestrates the entire booking flow:
   * - Step 1: Select Doctor
   * - Step 2: Select Service (for that doctor)
   * - Step 3: Select Date
   * - Step 4: Select Time (available slots)
   * - Step 5: Enter Patient Info
   * - Step 6: Confirm Booking
   *
   * SVELTE 5 PATTERN: Using $state() for managing the booking flow
   */

  // Current step in booking flow (1-6)
  let step = $state(1);

  // Booking data
  let selectedDoctor = $state<Doctor | null>(null);
  let selectedService = $state<Service | null>(null);
  let selectedDate = $state('');
  let selectedTime = $state('');
  let patientInfo = $state<{
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNotes?: string;
  } | null>(null);

  /**
   * Handle doctor selection
   * Move to next step
   */
  function handleDoctorSelect(doctorId: string, doctor: Doctor) {
    selectedDoctor = doctor;
    step = 2;
    console.log('✅ Doctor selected:', doctor.name);
  }

  /**
   * Handle service selection
   * Move to next step
   */
  function handleServiceSelect(serviceId: string, service: Service) {
    selectedService = service;
    step = 3;
    console.log('✅ Service selected:', service.name);
  }

  /**
   * Handle date selection
   * Move to next step
   */
  function handleDateSelect(date: string) {
    selectedDate = date;
    step = 4;
    console.log('✅ Date selected:', date);
  }

  /**
   * Handle time selection
   * Move to next step
   */
  function handleTimeSelect(time: string) {
    selectedTime = time;
    step = 5;
    console.log('✅ Time selected:', time);
  }

  /**
   * Handle patient info submission
   * Move to summary step
   */
  function handlePatientInfoSubmit(data: any) {
    patientInfo = data;
    step = 6;
    console.log('✅ Patient info collected');
  }

  /**
   * Handle booking confirmation
   * Redirect to confirmation page with token
   */
  function handleBookingConfirm(token: string) {
    console.log('✅ Booking confirmed, redirecting...');
    goto(`/programare/confirmare?token=${encodeURIComponent(token)}`);
  }

  /**
   * Go back to previous step
   */
  function goBack() {
    if (step > 1) {
      // Reset data when going back
      if (step === 2) selectedDoctor = null;
      if (step === 3) selectedService = null;
      if (step === 4) selectedDate = '';
      if (step === 5) selectedTime = '';
      if (step === 6) patientInfo = null;
      step--;
    }
  }
</script>

<svelte:head>
  <title>Programare Online - Clinica SF. Gherasim</title>
  <meta
    name="description"
    content="Programează o consultație online la Clinica SF. Gherasim. Sistem rapid și simplu de rezervare pentru servicii de psihiatrie și psihologie."
  />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-12 md:py-16">
  <div class="container-custom">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">Programare Online</h1>
      <p class="text-lg text-gray-600 leading-relaxed">
        Alege specialistul și tipul de consultație. Sistemul nostru online îți permite să faci programări rapid și simplu.
      </p>
    </div>
  </div>
</section>

<!-- Progress Bar -->
<section class="bg-white border-b border-gray-200 sticky top-0 z-40">
  <div class="container-custom py-4">
    <div class="flex items-center justify-between max-w-4xl mx-auto">
      {#each [1, 2, 3, 4, 5, 6] as s}
        <div class="flex items-center">
          <!-- Step Circle -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200"
            class:bg-primary={s <= step}
            class:text-white={s <= step}
            class:bg-gray-200={s > step}
            class:text-gray-700={s > step}
          >
            {s}
          </div>

          <!-- Step Line -->
          {#if s < 6}
            <div
              class="h-1 flex-grow mx-2 transition-all duration-200"
              class:bg-primary={s < step}
              class:bg-gray-200={s >= step}
            />
          {/if}
        </div>
      {/each}
    </div>

    <!-- Step Labels (optional) -->
    <div class="text-center mt-2 text-xs text-gray-600">
      {#if step === 1}
        Selectează doctor
      {:else if step === 2}
        Selectează serviciu
      {:else if step === 3}
        Selectează data
      {:else if step === 4}
        Selectează ora
      {:else if step === 5}
        Informații pacient
      {:else if step === 6}
        Confirmă programarea
      {/if}
    </div>
  </div>
</section>

<!-- Booking Form Steps -->
<section class="section-spacing bg-white">
  <div class="container-custom max-w-2xl">
    {#if step === 1}
      <DoctorSelect onSelect={handleDoctorSelect} selectedDoctorId={selectedDoctor?.id} />
    {:else if step === 2 && selectedDoctor}
      <DoctorSelect onSelect={handleDoctorSelect} selectedDoctorId={selectedDoctor.id} />
      <div class="mt-8 pt-8 border-t border-gray-200">
        <ServiceSelect services={selectedDoctor.services} onSelect={handleServiceSelect} selectedServiceId={selectedService?.id} />
      </div>
    {:else if step === 3 && selectedService}
      <div class="mb-6 pb-6 border-b border-gray-200">
        <p class="text-sm font-semibold text-gray-600">
          <span class="text-primary">{selectedDoctor?.name}</span> • <span class="text-primary">{selectedService.name}</span>
        </p>
      </div>
      <DatePicker onSelect={handleDateSelect} selectedDate={selectedDate} />
    {:else if step === 4 && selectedDate}
      <div class="mb-6 pb-6 border-b border-gray-200">
        <p class="text-sm font-semibold text-gray-600">
          <span class="text-primary">{selectedDoctor?.name}</span> • <span class="text-primary">{selectedService?.name}</span> •
          <span class="text-primary">{new Date(selectedDate).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' })}</span>
        </p>
      </div>
      <TimePicker
        doctorId={selectedDoctor?.id}
        serviceId={selectedService?.id}
        date={selectedDate}
        onSelect={handleTimeSelect}
        selectedTime={selectedTime}
      />
    {:else if step === 5 && selectedTime}
      <div class="mb-6 pb-6 border-b border-gray-200">
        <p class="text-sm font-semibold text-gray-600">
          <span class="text-primary">{selectedDoctor?.name}</span> • <span class="text-primary">{selectedService?.name}</span> •
          <span class="text-primary">{new Date(selectedDate).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' })}</span> la
          <span class="text-primary">{selectedTime}</span>
        </p>
      </div>
      <PatientInfoForm onSubmit={handlePatientInfoSubmit} />
    {:else if step === 6 && patientInfo && selectedDoctor && selectedService}
      <BookingSummary
        doctor={selectedDoctor}
        service={selectedService}
        date={selectedDate}
        time={selectedTime}
        patientInfo={patientInfo}
        onConfirm={handleBookingConfirm}
      />
    {/if}

    <!-- Navigation Buttons -->
    {#if step > 1}
      <div class="mt-8 flex gap-4">
        <button
          on:click={goBack}
          class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          ← Înapoi
        </button>
      </div>
    {/if}
  </div>
</section>

<!-- Alternative Contact Methods -->
<section class="section-spacing bg-gray-50">
  <div class="container-custom max-w-3xl">
    <h2 class="text-2xl font-bold text-center mb-8">Probleme cu programarea online?</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <a
        href="tel:+40711039666"
        class="bg-white rounded-xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary"
      >
        <div class="text-3xl mb-3">📞</div>
        <h3 class="font-bold mb-2">Sună-ne</h3>
        <p class="text-primary text-lg font-medium">+40 711 039 666</p>
        <p class="text-sm text-gray-600 mt-2">Luni - Vineri: 09:00 - 18:00</p>
      </a>

      <a
        href="mailto:office@psimed.ro"
        class="bg-white rounded-xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary"
      >
        <div class="text-3xl mb-3">✉️</div>
        <h3 class="font-bold mb-2">Trimite email</h3>
        <p class="text-primary text-lg font-medium">office@psimed.ro</p>
        <p class="text-sm text-gray-600 mt-2">Răspundem în 24-48 ore</p>
      </a>
    </div>
  </div>
</section>

<style>
  :global(body) {
    background: white;
  }
</style>
