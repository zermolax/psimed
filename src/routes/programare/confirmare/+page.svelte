<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/atoms/Button.svelte';

	const appointmentId = $derived($page.url.searchParams.get('appointmentId') ?? '');
	const ntpID = $derived($page.url.searchParams.get('ntpID') ?? '');

	// Netopia redirects with the same URL we provided — no extra params are added by default.
	// The actual payment confirmation comes via IPN (server-side).
	// We show a "processing" / success page based on the presence of appointmentId.
	const hasAppointment = $derived(appointmentId !== '');
</script>

<svelte:head>
	<title>Confirmare Plată - Clinica Sf. Gherasim</title>
	<meta name="description" content="Confirmare plată programare online la Clinica Sf. Gherasim." />
</svelte:head>

<!-- Hero -->
<section
	class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-12 md:py-16"
>
	<div class="container-custom relative z-10">
		<div class="text-center max-w-3xl mx-auto">
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900 mb-4">
				Confirmare <span class="text-primary">Plată</span>
			</h1>
		</div>
	</div>
</section>

<!-- Content -->
<section class="py-12 bg-gray-50 min-h-[60vh]">
	<div class="container-custom">
		<div class="max-w-lg mx-auto">
			{#if hasAppointment}
				<!-- Payment received / processing -->
				<div class="bg-white rounded-xl p-8 md:p-12 shadow-lg text-center">
					<div
						class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<span class="text-4xl">✓</span>
					</div>

					<h2 class="text-2xl font-bold text-gray-900 mb-3">Plată procesată!</h2>
					<p class="text-gray-600 mb-2">
						Plata pentru programarea <strong>#{appointmentId}</strong> a fost transmisă spre procesare.
					</p>
					<p class="text-gray-500 text-sm mb-6">
						Veți primi o confirmare prin email după verificarea plății. Dacă aveți întrebări,
						contactați-ne direct.
					</p>

					{#if ntpID}
						<p class="text-xs text-gray-400 mb-6">Referință plată: {ntpID}</p>
					{/if}

					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-8">
						<p class="text-sm text-blue-800 font-medium mb-1">Ce urmează?</p>
						<ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
							<li>Plata este verificată automat de Netopia Payments</li>
							<li>Programarea este confirmată în sistem</li>
							<li>Veniți la clinică la data și ora selectate</li>
						</ul>
					</div>

					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<Button href="/">Pagina Principală</Button>
						<Button variant="secondary" href="/programare">Programare Nouă</Button>
					</div>
				</div>
			{:else}
				<!-- No appointmentId — something went wrong or user navigated directly -->
				<div class="bg-white rounded-xl p-8 md:p-12 shadow-lg text-center">
					<div
						class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<span class="text-4xl">✕</span>
					</div>

					<h2 class="text-2xl font-bold text-gray-900 mb-3">Plată anulată sau eșuată</h2>
					<p class="text-gray-600 mb-6">
						Plata nu a putut fi finalizată. Programarea nu a fost confirmată. Puteți reîncerca sau ne
						puteți contacta direct.
					</p>

					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<Button href="/programare">Încearcă din nou</Button>
						<Button variant="secondary" href="/contact">Contactează-ne</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Contact fallback -->
<section class="py-8 bg-white">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<p class="text-gray-600 mb-4">Aveți nevoie de ajutor? Sunați-ne direct.</p>
			<a
				href="tel:+40234123456"
				class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
			>
				📞 +40 234 123 456
			</a>
		</div>
	</div>
</section>
