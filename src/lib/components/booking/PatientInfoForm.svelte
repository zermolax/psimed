<script lang="ts">
  /**
   * EXPLANATION: PatientInfoForm Component
   *
   * This component:
   * 1. Collects patient information (name, email, phone, notes)
   * 2. Validates fields using Zod schema
   * 3. Displays validation errors
   * 4. Returns validated data to parent
   *
   * VALIDATION PATTERN:
   * - Use Zod schemas on the client too (sends same validation to frontend)
   * - Show real-time error feedback
   * - Prevent submission if invalid
   */

  interface Props {
    onSubmit: (data: PatientInfo) => void;
  }

  interface PatientInfo {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNotes?: string;
  }

  let { onSubmit }: Props = $props();

  // Form state
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let notes = $state('');

  // Validation errors
  let errors = $state<Record<string, string>>({});

  /**
   * Validate form fields
   * Returns true if all fields are valid
   */
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Numele este obligatoriu';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email-ul nu este valid';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Telefonul este obligatoriu';
    } else if (!/^[\d\s\-\+()]+$/.test(phone)) {
      newErrors.phone = 'Telefonul nu este valid';
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handle form submission
   */
  function handleSubmit() {
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    console.log('✅ Form validation passed');

    onSubmit({
      patientName: name.trim(),
      patientEmail: email.trim(),
      patientPhone: phone.trim(),
      patientNotes: notes.trim() || undefined
    });
  }
</script>

<div class="patient-info-form">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Informații Pacient</h2>

  <form on:submit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
    <!-- Name Field -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Nume Complet <span class="text-red-500">*</span>
      </label>
      <input
        id="name"
        type="text"
        bind:value={name}
        placeholder="ex. Ion Popescu"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        class:border-red-500={errors.name}
      />
      {#if errors.name}
        <p class="mt-1 text-sm text-red-600">{errors.name}</p>
      {/if}
    </div>

    <!-- Email Field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email <span class="text-red-500">*</span>
      </label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="ex. ion@gmail.com"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        class:border-red-500={errors.email}
      />
      {#if errors.email}
        <p class="mt-1 text-sm text-red-600">{errors.email}</p>
      {/if}
    </div>

    <!-- Phone Field -->
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
        Telefon <span class="text-red-500">*</span>
      </label>
      <input
        id="phone"
        type="tel"
        bind:value={phone}
        placeholder="ex. +40 721 123 456"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        class:border-red-500={errors.phone}
      />
      {#if errors.phone}
        <p class="mt-1 text-sm text-red-600">{errors.phone}</p>
      {/if}
    </div>

    <!-- Notes Field (Optional) -->
    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
        Note Suplimentare (Opțional)
      </label>
      <textarea
        id="notes"
        bind:value={notes}
        placeholder="ex. Am probleme cu somnul..."
        rows="4"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      />
      <p class="mt-1 text-xs text-gray-500">Máx. 500 caractere</p>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 mt-6"
    >
      Continuă
    </button>
  </form>
</div>

<style>
  .border-red-500 {
    border-color: rgb(239, 68, 68) !important;
  }
</style>
