<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import servicesData from '../../content/data/services.json';

	// Service color mapping - synchronized with homepage
	const serviceColors = {
		'psihiatrie-adulti': {
			bg: 'bg-primary-light',
			text: 'text-primary-dark',
			border: 'border-primary',
			buttonBg: '#dd4444',
			accent: 'text-primary'
		},
		'psihiatrie-pediatrica': {
			bg: 'bg-secondary-light',
			text: 'text-secondary-dark',
			border: 'border-secondary',
			buttonBg: '#9370db',
			accent: 'text-secondary'
		},
		'psihologie-clinica': {
			bg: 'bg-accent-light',
			text: 'text-accent-dark',
			border: 'border-accent',
			buttonBg: '#2ba89b',
			accent: 'text-accent'
		},
		'psihoterapie': {
			bg: 'bg-nature-light',
			text: 'text-nature-dark',
			border: 'border-nature',
			buttonBg: '#4ba85f',
			accent: 'text-nature'
		},
		'terapii-complementare': {
			bg: 'bg-sunshine-light',
			text: 'text-gray-800',
			border: 'border-sunshine',
			buttonBg: '#d4a500',
			accent: 'text-sunshine'
		},
		'evaluari-psihologice': {
			bg: 'bg-accent-light',
			text: 'text-accent-dark',
			border: 'border-accent',
			buttonBg: '#2ba89b',
			accent: 'text-accent'
		}
	};

	let activeServiceId = $state('psihiatrie-adulti');
	let scrolled = $state(false);

	function setActiveService(id: string) {
		activeServiceId = id;
		// Update hash without triggering double-scroll
		if (typeof window !== 'undefined') {
			window.history.replaceState(null, '', `#${id}`);
		}
		// Small delay to ensure state is updated before scroll
		setTimeout(() => {
			const element = document.getElementById(`service-${id}`);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 0);
	}

	// Check for hash on mount only (once)
	$effect.pre(() => {
		if (typeof window !== 'undefined' && window.location.hash && activeServiceId === 'psihiatrie-adulti') {
			const hash = window.location.hash.substring(1);
			const service = servicesData.find((s) => s.id === hash);
			if (service) {
				activeServiceId = hash;
			}
		}
	});

	let activeService = $derived(servicesData.find((s) => s.id === activeServiceId) || servicesData[0]);
	let activeServiceColor = $derived(serviceColors[activeServiceId as keyof typeof serviceColors] || serviceColors['psihiatrie-adulti']);
</script>

<svelte:head>
	<title>Servicii Medicale - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Servicii complete de psihiatrie, psihologie și psihoterapie pentru adulți și copii în Bacău. Echipă specializată și tratamente moderne."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-20 pb-8 md:pb-10">
	<div class="container-custom">
		<div class="max-w-4xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900">
				Serviciile <span class="text-primary">Noastre</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-700 leading-relaxed">
				Oferim o gamă completă de servicii de sănătate mentală, de la diagnostic și tratament psihiatric până la psihoterapie și terapii complementare moderne. Fiecare serviciu este conceput pentru a răspunde nevoilor unice ale pacienților noștri.
			</p>
		</div>
	</div>
</section>

<!-- Sticky Service Navigation Tabs with Color Coding -->
<section class="bg-white border-b border-gray-200 sticky top-[73px] z-40 shadow-md">
	<div class="container-custom">
		<div class="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0 md:gap-2">
			{#each servicesData as service}
				{@const isActive = activeServiceId === service.id}
				{@const colors = serviceColors[service.id as keyof typeof serviceColors]}
				<button
					onclick={() => setActiveService(service.id)}
					aria-current={isActive ? 'page' : undefined}
					class="flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-bold transition-all whitespace-nowrap border-2 text-sm md:text-base"
					class:shadow-lg={isActive}
					class:scale-105={isActive}
					style="
						background-color: {isActive ? colors.buttonBg : 'white'};
						color: {isActive ? 'white' : colors.buttonBg};
						border-color: {colors.buttonBg};
					"
				>
					{service.title}
				</button>
			{/each}
		</div>
	</div>
</section>


<!-- Active Service Content with Color-Coded Design -->
<section class="bg-gray-50 min-h-screen">
	{#each servicesData as service}
		{#if service.id === activeServiceId}
			{@const colors = serviceColors[service.id as keyof typeof serviceColors]}
			<div id="service-{service.id}" class="scroll-mt-50">
				<!-- Service Header with Branded Background -->
				<div class="{colors.bg} border-b-4 {colors.border} py-12 md:py-16">
					<div class="container-custom">
						<div class="max-w-4xl mx-auto">
							<!-- Icon Section -->
							<div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
								<div class="shrink-0">
									<div class="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 {colors.bg} rounded-3xl border-4 {colors.border} bg-white shadow-lg">
										<Icon name={service.icon} size="64" class="{colors.accent}" />
									</div>
								</div>
								<div class="flex-1">
									<h1 class="text-3xl md:text-4xl lg:text-5xl font-black mb-3 {colors.text}">{service.title}</h1>
									<p class="text-lg md:text-xl text-gray-700 leading-relaxed">{service.description}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Service Content -->
				<section class="py-12 md:py-16 bg-white">
					<div class="container-custom">
						<div class="max-w-4xl mx-auto space-y-12">
							<!-- Intro Section -->
							<div class="{colors.bg} p-8 md:p-10 rounded-2xl border-l-4 {colors.border}">
								<p class="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">{service.content.intro}</p>
							</div>

							<!-- What We Treat -->
							<div class="grid md:grid-cols-2 gap-8">
								<div class="{colors.bg} p-8 md:p-10 rounded-2xl border-t-4 {colors.border}">
									<div class="flex items-center gap-3 mb-6">
										<div class="shrink-0 w-10 h-10 flex items-center justify-center {colors.accent} rounded-full">
											<Icon name="check" size="20" class="text-white" />
										</div>
										<h2 class="text-2xl md:text-3xl font-bold {colors.text}">Ce tratăm?</h2>
									</div>
									<div class="space-y-3">
										{#each service.content.whatWeTreat.slice(0, Math.ceil(service.content.whatWeTreat.length / 2)) as condition}
											<div class="flex items-start gap-3">
												<div class="shrink-0 w-6 h-6 flex items-center justify-center {colors.accent} rounded-lg text-white font-bold text-xs">
													✓
												</div>
												<span class="text-gray-800 font-medium text-base">{condition}</span>
											</div>
										{/each}
									</div>
								</div>
								<div class="{colors.bg} p-8 md:p-10 rounded-2xl border-t-4 {colors.border}">
									<div class="space-y-3">
										{#each service.content.whatWeTreat.slice(Math.ceil(service.content.whatWeTreat.length / 2)) as condition}
											<div class="flex items-start gap-3">
												<div class="shrink-0 w-6 h-6 flex items-center justify-center {colors.accent} rounded-lg text-white font-bold text-xs">
													✓
												</div>
												<span class="text-gray-800 font-medium text-base">{condition}</span>
											</div>
										{/each}
									</div>
								</div>
							</div>

							<!-- Approach -->
							<div class="{colors.bg} p-8 md:p-10 rounded-2xl border-l-4 {colors.border}">
								<h2 class="text-2xl md:text-3xl font-bold {colors.text} mb-6">Abordarea Noastră</h2>
								<p class="text-lg text-gray-800 leading-relaxed">{service.content.approach}</p>
							</div>

							<!-- Process Steps -->
							<div class="{colors.bg} p-8 md:p-10 rounded-2xl border-t-4 {colors.border}">
								<h2 class="text-2xl md:text-3xl font-bold {colors.text} mb-8">Procesul de Tratament</h2>
								<div class="space-y-5">
									{#each service.content.process as step, index}
										<div class="flex gap-5 items-start">
											<div class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full" style="background-color: {serviceColors[service.id as keyof typeof serviceColors].buttonBg};">
												{index + 1}
											</div>
											<div class="flex-1 pt-2">
												<p class="text-lg text-gray-800 font-semibold">{step}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Trust Indicators -->
							<div class="grid md:grid-cols-3 gap-6">
								<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
									<div class="text-4xl mb-3">🏆</div>
									<h3 class="font-bold text-gray-900 mb-1">15+ ani</h3>
									<p class="text-gray-600 text-sm">de experiență în domeniu</p>
								</div>
								<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
									<div class="text-4xl mb-3">⭐</div>
									<h3 class="font-bold text-gray-900 mb-1">95% satisfacție</h3>
									<p class="text-gray-600 text-sm">rate de satisfacție pacienți</p>
								</div>
								<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
									<div class="text-4xl mb-3">🎯</div>
									<h3 class="font-bold text-gray-900 mb-1">Personalizat</h3>
									<p class="text-gray-600 text-sm">tratament adaptat nevoilor tale</p>
								</div>
							</div>

							<!-- Strong CTA Section -->
							<div class="{colors.bg} p-10 md:p-12 rounded-3xl border-4 {colors.border} text-center shadow-xl">
								<h2 class="text-3xl md:text-4xl font-black {colors.text} mb-4">Gata să Începi?</h2>
								<p class="text-lg text-gray-700 mb-8 leading-relaxed">
									Programează o consultație pentru a discuta despre nevoile tale și cum putem ajuta.
								</p>
								<div class="flex flex-col sm:flex-row gap-4 justify-center">
									<Button href="/programare?service={service.id}" variant="primary" size="lg">
										📅 Programează Consultație pentru {service.title}
									</Button>
									<Button href="/contact" variant="secondary" size="lg">
										💬 Contactează-ne
									</Button>
								</div>
								<p class="text-sm text-gray-600 mt-6">
									Nu îți faci griji - putem discuta ofertele și programul în funcție de nevoile tale.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		{/if}
	{/each}
</section>

<!-- Related Services Section with Color System -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="text-center mb-14">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">
				Explorează <span class="text-primary">Alte Servicii</span>
			</h2>
			<p class="text-lg text-gray-600">Descoperă cum putem ajuta la sănătatea ta mentală</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each servicesData.filter((s) => s.id !== activeServiceId) as service}
				{@const colors = serviceColors[service.id as keyof typeof serviceColors]}
				<button
					onclick={() => setActiveService(service.id)}
					class="{colors.bg} rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-3 {colors.border}"
				>
					<div class="inline-flex items-center justify-center w-16 h-16 {colors.bg} rounded-2xl mb-6 border-3 {colors.border}">
						<Icon name={service.icon} size="32" class="{colors.accent}" />
					</div>
					<h3 class="text-xl font-bold {colors.text} mb-2">{service.title}</h3>
					<p class="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
					<div class="flex items-center gap-2 {colors.accent} font-bold">
						<span>Vezi mai mult</span>
						<Icon name="arrow-right" size="16" />
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Bottom CTA Section -->
<section class="section-spacing bg-linear-to-br from-primary-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center border-4 border-primary/10">
			<div class="text-6xl md:text-7xl mb-6">💙</div>
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-6">
				Ești gata pentru schimbare?
			</h2>
			<p class="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
				Fii parte din comunitatea noastră de pacienți mulțumiți. Contactează-ne astăzi și fă primul pas spre o sănătate mentală mai bună.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare" variant="primary" size="lg">
					🗓️ Programează Consultație
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					📞 Sună-ne Astăzi
				</Button>
			</div>
		</div>
	</div>
</section>
