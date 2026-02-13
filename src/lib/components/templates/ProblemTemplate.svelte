<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	interface Props {
		title: string;
		subtitle: string;
		category: 'copii' | 'adulti';
		heroDescription: string;
		symptoms: string[];
		whenToSeekHelp: string[];
		treatments: Array<{ name: string; description: string }>;
		specialists: string[];
		relatedProblems?: Array<{ title: string; href: string }>;
		ctaText?: string;
		specialtyParam?: string;
	}

	let {
		title,
		subtitle,
		category,
		heroDescription,
		symptoms,
		whenToSeekHelp,
		treatments,
		specialists,
		relatedProblems = [],
		ctaText = 'Programează o evaluare',
		specialtyParam = ''
	}: Props = $props();

	const categoryConfig = {
		copii: {
			badge: 'Pentru Copii',
			badgeClass: 'bg-secondary text-white',
			accentColor: 'secondary',
			gradient: 'from-secondary-light via-white to-accent-light'
		},
		adulti: {
			badge: 'Pentru Adulți',
			badgeClass: 'bg-primary text-white',
			accentColor: 'primary',
			gradient: 'from-primary-light via-white to-secondary-light'
		}
	};

	const config = categoryConfig[category];
	const bookingUrl = specialtyParam ? `/programare?specialty=${specialtyParam}` : '/programare';
</script>

<svelte:head>
	<title>{title} - Clinica Sf. Gherasim</title>
	<meta name="description" content={heroDescription} />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br {config.gradient} py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-{config.accentColor}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl">
			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-sm text-gray-600 mb-6">
				<a href="/" class="hover:text-{config.accentColor} transition-colors">Acasă</a>
				<span>/</span>
				<a href="/ce-tratam" class="hover:text-{config.accentColor} transition-colors">Ce Tratăm</a>
				<span>/</span>
				<span class="text-gray-900 font-medium">{title}</span>
			</nav>

			<!-- Category Badge -->
			<span class="inline-block {config.badgeClass} px-4 py-2 rounded-full text-sm font-bold mb-4">
				{config.badge}
			</span>

			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
				{title}
			</h1>

			<p class="text-xl text-gray-700 mb-2">{subtitle}</p>

			<p class="text-lg text-gray-600 leading-relaxed max-w-3xl mb-8">
				{heroDescription}
			</p>

			<Button href={bookingUrl} variant={category === 'copii' ? 'secondary' : 'primary'} size="lg">
				{ctaText}
			</Button>
		</div>
	</div>
</section>

<!-- Main Content -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid lg:grid-cols-3 gap-12">
			<!-- Left Column: Symptoms & When to Seek Help -->
			<div class="lg:col-span-2 space-y-12">
				<!-- Symptoms Section -->
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
						<span class="w-10 h-10 bg-{config.accentColor}/10 rounded-lg flex items-center justify-center">
							<Icon name="check" size={20} class="text-{config.accentColor}" />
						</span>
						Semne și Simptome
					</h2>

					<div class="bg-gray-50 rounded-2xl p-6 md:p-8">
						<ul class="space-y-4">
							{#each symptoms as symptom}
								<li class="flex items-start gap-3">
									<span class="flex-shrink-0 w-6 h-6 bg-{config.accentColor} rounded-full flex items-center justify-center mt-0.5">
										<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</span>
									<span class="text-gray-700">{symptom}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- When to Seek Help -->
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
						<span class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
							<Icon name="heart" size={20} class="text-amber-600" />
						</span>
						Când să Ceri Ajutor
					</h2>

					<div class="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-6 md:p-8">
						<p class="text-gray-700 mb-4 font-medium">
							Este important să soliciți o evaluare profesională dacă observi:
						</p>
						<ul class="space-y-3">
							{#each whenToSeekHelp as item}
								<li class="flex items-start gap-3">
									<span class="text-amber-500 mt-1">●</span>
									<span class="text-gray-700">{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- Treatments -->
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
						<span class="w-10 h-10 bg-nature/10 rounded-lg flex items-center justify-center">
							<Icon name="brain" size={20} class="text-nature" />
						</span>
						Abordări Terapeutice
					</h2>

					<div class="grid sm:grid-cols-2 gap-4">
						{#each treatments as treatment}
							<div class="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-{config.accentColor}/30 hover:shadow-md transition-all">
								<h3 class="font-bold text-gray-900 mb-2">{treatment.name}</h3>
								<p class="text-sm text-gray-600">{treatment.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Column: Sidebar -->
			<div class="space-y-6">
				<!-- CTA Box -->
				<div class="bg-{config.accentColor} rounded-2xl p-6 text-white sticky top-24">
					<h3 class="text-xl font-bold mb-3">Ai nevoie de ajutor?</h3>
					<p class="text-white/90 mb-6 text-sm">
						Echipa noastră de specialiști este aici pentru tine. Programează o evaluare pentru a primi un plan de tratament personalizat.
					</p>
					<Button href={bookingUrl} variant="primary" size="md" class="w-full bg-white text-{config.accentColor} hover:bg-gray-100">
						{ctaText}
					</Button>
					<p class="text-white/70 text-xs mt-4 text-center">
						sau sună la <a href="tel:+40234123456" class="underline">0234 123 456</a>
					</p>
				</div>

				<!-- Specialists -->
				<div class="bg-gray-50 rounded-2xl p-6">
					<h3 class="font-bold text-gray-900 mb-4">Specialiști Recomandați</h3>
					<ul class="space-y-2">
						{#each specialists as specialist}
							<li class="flex items-center gap-2 text-gray-700">
								<Icon name="user" size={16} class="text-{config.accentColor}" />
								<span class="text-sm">{specialist}</span>
							</li>
						{/each}
					</ul>
					<a href="/specialisti" class="inline-flex items-center gap-1 text-{config.accentColor} font-medium text-sm mt-4 hover:underline">
						Vezi toți specialiștii
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>

				<!-- Related Problems -->
				{#if relatedProblems.length > 0}
					<div class="bg-gray-50 rounded-2xl p-6">
						<h3 class="font-bold text-gray-900 mb-4">Probleme Asociate</h3>
						<ul class="space-y-2">
							{#each relatedProblems as problem}
								<li>
									<a href={problem.href} class="flex items-center gap-2 text-gray-700 hover:text-{config.accentColor} transition-colors">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
										</svg>
										<span class="text-sm">{problem.title}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Bottom CTA -->
<section class="section-spacing bg-gradient-to-br {config.gradient}">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Primul Pas Către Vindecare
			</h2>
			<p class="text-lg text-gray-700 mb-8">
				Nu ești singur în această călătorie. Echipa noastră de specialiști te poate ajuta să înțelegi mai bine situația și să găsești cele mai potrivite soluții.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href={bookingUrl} variant={category === 'copii' ? 'secondary' : 'primary'} size="lg">
					{ctaText}
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					Contactează-ne
				</Button>
			</div>
		</div>
	</div>
</section>
