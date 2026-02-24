<script lang="ts">
	import { page } from '$app/stores';

	const orderId = $derived($page.url.searchParams.get('orderId') || '');
	const status = $derived($page.url.searchParams.get('status') || '');
	const isCancelled = $derived(status === 'cancel' || status === 'canceled');
</script>

<svelte:head>
	<title>
		{isCancelled ? 'Plată anulată' : 'Programare confirmată'} — Clinica Sf. Gherasim
	</title>
</svelte:head>

<section class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
	<div class="max-w-2xl w-full mx-auto">
		{#if isCancelled}
			<!-- Payment cancelled / failed -->
			<div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
				<div
					class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<span class="text-4xl text-red-600">✕</span>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-3">Plată anulată</h1>
				<p class="text-gray-600 mb-8">
					Plata nu a fost finalizată. Programarea <strong>nu a fost creată</strong>.
					Puteți încerca din nou sau ne puteți contacta telefonic.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/programare"
						class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
					>
						Încearcă din nou
					</a>
					<a
						href="tel:+40711039666"
						class="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-colors"
					>
						📞 0711 039 666
					</a>
				</div>
			</div>
		{:else}
			<!-- Payment successful -->
			<div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
				<div
					class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<span class="text-4xl text-green-600">✓</span>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-3">Plată confirmată!</h1>
				<p class="text-gray-600 mb-2">
					Programarea dumneavoastră a fost înregistrată cu succes.
				</p>
				<p class="text-gray-500 text-sm mb-8">
					Clinica vă va contacta în scurt timp pentru a confirma detaliile.
				</p>

				{#if orderId}
					<div class="bg-gray-50 rounded-lg px-6 py-3 inline-block mb-8">
						<p class="text-sm text-gray-500">Referință plată</p>
						<p class="font-mono text-gray-700 text-sm">{orderId}</p>
					</div>
				{/if}

				<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-left">
					<h2 class="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">
						Ce urmează?
					</h2>
					<ul class="space-y-2 text-sm text-blue-800">
						<li>• Veți primi un apel de confirmare din partea clinicii</li>
						<li>• Veniți cu 10 minute înainte de ora programată</li>
						<li>• Aduceți actul de identitate</li>
					</ul>
				</div>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/"
						class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
					>
						Pagina principală
					</a>
					<a
						href="/programare"
						class="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors"
					>
						Programare nouă
					</a>
					<button
						onclick={() => window.print()}
						class="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors"
					>
						🖨️ Imprimă
					</button>
				</div>
			</div>
		{/if}

		<!-- Contact info -->
		<div class="mt-8 text-center text-sm text-gray-500">
			<p>
				Probleme? Contactați-ne la
				<a href="tel:+40711039666" class="text-primary font-medium">0711 039 666</a>
				sau
				<a href="mailto:office@psimed.ro" class="text-primary font-medium">office@psimed.ro</a>
			</p>
		</div>
	</div>
</section>
