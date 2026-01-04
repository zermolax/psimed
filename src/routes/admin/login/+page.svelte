<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import Button from '$lib/components/atoms/Button.svelte';

  /**
   * EXPLANATION: Svelte 5 Script Block
   *
   * let loading = $state(false)
   * - $state() is a Svelte 5 rune that makes a variable reactive
   * - When you change loading, the component re-renders
   * - $state is only for component-level state
   */
  let loading = $state(false);
  let email = $state('');
  let password = $state('');

  /**
   * EXPLANATION: Server Form Actions
   *
   * The form below uses method="POST" which calls the default action in +page.server.ts
   * The enhance() function handles:
   * - Setting loading = true while submitting
   * - Preventing page reload
   * - Updating form state with errors
   */
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Clinica SF. Gherasim</h1>
      <p class="text-gray-600">Doctor Login</p>
    </div>

    <!-- Error Message -->
    {#if $page.form?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {$page.form.error}
      </div>
    {/if}

    <!-- Login Form -->
    <form
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
      class="space-y-4"
    >
      <!-- Email Input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="teodora@clinica.ro"
          bind:value={email}
          required
          disabled={loading}
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <!-- Password Input -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          bind:value={password}
          required
          disabled={loading}
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <!-- Submit Button -->
      <Button
        type="submit"
        variant="primary"
        class="w-full"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>

    <!-- Test Credentials Info -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <p class="text-sm text-gray-600 mb-2">
        <strong>Test Credentials:</strong>
      </p>
      <p class="text-sm text-gray-700 font-mono">
        Email: teodora@clinica.ro<br />
        Password: test123
      </p>
    </div>
  </div>
</div>

<style>
  /* Optional: Add animations */
</style>
