<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import PriceTable from '$lib/components/molecules/PriceTable.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Servicii și Prețuri - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Lista completă de servicii și prețuri pentru consultații psihiatrice, evaluări psihologice, psihoterapie și tratamente la Clinica Sf. Gherasim."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
				Servicii și <span class="text-primary">Prețuri</span>
			</h1>
			<p class="text-xl text-gray-700 leading-relaxed mb-8">
				Transparență totală în privința costurilor. Aici găsești lista completă a serviciilor
				noastre cu prețurile aferente. Prețurile pot varia în funcție de complexitatea cazului.
			</p>
			<div class="flex flex-wrap gap-4">
				<Button href="/programare" variant="primary" size="lg">
					Programează o consultație
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					Întrebări despre prețuri?
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Notice -->
<section class="py-6 bg-amber-50 border-y border-amber-200">
	<div class="container-custom">
		<div class="flex items-start gap-3">
			<span class="text-2xl">💡</span>
			<div>
				<p class="text-amber-800 font-medium">
					Prețurile afișate sunt orientative și pot varia în funcție de complexitatea cazului.
				</p>
				<p class="text-amber-700 text-sm mt-1">
					Pentru un preț exact, vă recomandăm să ne contactați sau să programați o consultație inițială.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Price Table -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		{#if data.priceItems && data.priceItems.length > 0}
			<PriceTable items={data.priceItems} />
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-600">Lista de prețuri nu este disponibilă momentan.</p>
				<p class="text-gray-500 text-sm mt-2">Vă rugăm să ne contactați pentru informații despre prețuri.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Payment Info -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl font-black text-gray-900 mb-8 text-center">
				Informații Utile
			</h2>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- Payment Methods -->
				<div class="bg-gray-50 rounded-2xl p-6">
					<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						<span class="text-2xl">💳</span>
						Metode de Plată
					</h3>
					<ul class="space-y-2 text-gray-600">
						<li class="flex items-center gap-2">
							<svg class="w-5 h-5 text-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Numerar
						</li>
						<li class="flex items-center gap-2">
							<svg class="w-5 h-5 text-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Card bancar (Visa, Mastercard)
						</li>
						<li class="flex items-center gap-2">
							<svg class="w-5 h-5 text-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Transfer bancar
						</li>
					</ul>
				</div>

				<!-- Insurance -->
				<div class="bg-gray-50 rounded-2xl p-6">
					<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						<span class="text-2xl">🏥</span>
						Decontare
					</h3>
					<p class="text-gray-600 mb-3">
						Clinica noastră nu are contract cu Casa de Asigurări de Sănătate.
						Toate serviciile sunt oferite în regim privat.
					</p>
					<p class="text-gray-500 text-sm">
						La cerere, eliberăm documente pentru decontare prin asigurări private.
					</p>
				</div>

				<!-- Cancellation -->
				<div class="bg-gray-50 rounded-2xl p-6">
					<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						<span class="text-2xl">📅</span>
						Politica de Anulare
					</h3>
					<p class="text-gray-600">
						Programările pot fi anulate sau reprogramate gratuit cu cel puțin
						<strong>24 de ore</strong> înainte. Anulările tardive pot fi supuse unei taxe.
					</p>
				</div>

				<!-- First Visit -->
				<div class="bg-gray-50 rounded-2xl p-6">
					<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						<span class="text-2xl">👋</span>
						Prima Vizită
					</h3>
					<p class="text-gray-600">
						La prima consultație, vă rugăm să aduceți documente medicale relevante
						(analize, scrisori medicale anterioare) și să ajungeți cu 10 minute înainte.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="section-spacing bg-gradient-to-br from-primary-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Ai întrebări despre prețuri?
			</h2>
			<p class="text-lg text-gray-700 mb-8">
				Nu ezita să ne contactezi pentru orice nelămurire. Suntem aici să te ajutăm
				să înțelegi opțiunile disponibile și să alegi ce e mai potrivit pentru tine.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/contact" variant="primary" size="lg">
					Contactează-ne
				</Button>
				<a
					href="tel:+40234123456"
					class="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
				>
					📞 0234 123 456
				</a>
			</div>
		</div>
	</div>
</section>
