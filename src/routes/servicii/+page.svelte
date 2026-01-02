<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import servicesData from '../../content/data/services.json';

	let activeServiceId = $state('psihiatrie-adulti');

	function setActiveService(id: string) {
		activeServiceId = id;
		// Scroll la secțiune
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	$effect(() => {
		// Update URL hash când se schimbă serviciul activ
		if (typeof window !== 'undefined') {
			window.location.hash = activeServiceId;
		}
	});

	// Check for hash on mount
	$effect(() => {
		if (typeof window !== 'undefined' && window.location.hash) {
			const hash = window.location.hash.substring(1);
			const service = servicesData.find((s) => s.id === hash);
			if (service) {
				activeServiceId = hash;
			}
		}
	});

	let activeService = $derived(servicesData.find((s) => s.id === activeServiceId) || servicesData[0]);
</script>

<svelte:head>
	<title>Servicii Medicale - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Servicii complete de psihiatrie, psihologie și psihoterapie pentru adulți și copii în Bacău. Echipă specializată și tratamente moderne."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Serviciile Noastre</h1>
			<p class="text-xl text-gray-700 leading-relaxed">
				Oferim o gamă completă de servicii de sănătate mentală, de la diagnostic și tratament
				psihiatric până la psihoterapie și terapii complementare moderne.
			</p>
		</div>
	</div>
</section>

<!-- Services Navigation Tabs -->
<section class="bg-white border-b border-gray-200 sticky top-[73px] z-40">
	<div class="container-custom">
		<div class="flex overflow-x-auto gap-2 py-4 -mx-4 px-4 md:mx-0 md:px-0">
			{#each servicesData as service}
				<button
					onclick={() => setActiveService(service.id)}
					class="flex-shrink-0 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap border-2"
					class:bg-gray-900={activeServiceId === service.id}
					class:text-white={activeServiceId === service.id}
					class:border-gray-900={activeServiceId === service.id}
					class:bg-white={activeServiceId !== service.id}
					class:text-gray-900={activeServiceId !== service.id}
					class:border-gray-200={activeServiceId !== service.id}
					class:hover:border-gray-400={activeServiceId !== service.id}
				>
					{service.title}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Active Service Content -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		{#each servicesData as service}
			{#if service.id === activeServiceId}
				<div id={service.id} class="max-w-4xl mx-auto">
					<!-- Header -->
					<div class="text-center mb-12">
						<div class="inline-block p-6 bg-gray-900 rounded-2xl mb-6 shadow-xl">
							<Icon name={service.icon} size="64" class="text-white" />
						</div>
						<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{service.title}</h2>
						<p class="text-xl text-gray-700">{service.description}</p>
					</div>

					<!-- Intro -->
					<div class="mb-12">
						<p class="text-lg text-gray-700 leading-relaxed">{service.content.intro}</p>
					</div>

					<!-- What We Treat -->
					<div class="mb-12">
						<h3 class="text-2xl font-bold mb-6 text-gray-900">Ce tratăm?</h3>
						<div class="grid md:grid-cols-2 gap-4">
							{#each service.content.whatWeTreat as condition}
								<div class="flex items-start space-x-3">
									<Icon name="check" size="20" class="text-nature flex-shrink-0 mt-1" />
									<span class="text-gray-800">{condition}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Approach -->
					<div class="mb-12 bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
						<h3 class="text-2xl font-bold mb-4 text-gray-900">Abordarea noastră</h3>
						<p class="text-lg text-gray-800 leading-relaxed">{service.content.approach}</p>
					</div>

					<!-- Process -->
					<div class="mb-12">
						<h3 class="text-2xl font-bold mb-6 text-gray-900">Procesul de tratament</h3>
						<div class="space-y-4">
							{#each service.content.process as step, index}
								<div class="flex items-start space-x-4">
									<div
										class="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm"
									>
										{index + 1}
									</div>
									<p class="text-lg text-gray-800 pt-0.5">{step}</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- CTA -->
					<div class="text-center pt-8 border-t border-gray-200">
						<h3 class="text-2xl font-bold mb-4">Gata să începi?</h3>
						<p class="text-gray-600 mb-6">
							Programează o consultație pentru a discuta despre nevoile tale specifice.
						</p>
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<Button href="/programare" variant="primary" size="lg">
								Programează Consultație
							</Button>
							<Button href="/contact" variant="outline" size="lg"> Contactează-ne </Button>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- Related Services -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<h2 class="text-3xl font-bold text-center mb-12">Alte servicii</h2>
		<div class="grid md:grid-cols-3 gap-8">
			{#each servicesData.filter((s) => s.id !== activeServiceId).slice(0, 3) as service}
				<button
					onclick={() => setActiveService(service.id)}
					class="bg-white rounded-xl p-6 text-left hover:shadow-lg transition-shadow border border-gray-200"
				>
					<div class="text-primary mb-4">
						<Icon name={service.icon} size="48" />
					</div>
					<h3 class="text-xl font-bold mb-2">{service.title}</h3>
					<p class="text-gray-600 mb-4">{service.description}</p>
					<span class="text-primary font-medium inline-flex items-center space-x-1">
						<span>Vezi detalii</span>
						<Icon name="arrow-right" size="16" />
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
