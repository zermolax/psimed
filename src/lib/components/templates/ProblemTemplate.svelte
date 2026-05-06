<script lang="ts">
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

	const isChild = category === 'copii';
	const categoryLabel = isChild ? 'Pentru Copii' : 'Pentru Adulți';
	// Color palette consistent with homepage / servicii-si-preturi:
	// adulți → primary (#c13333), copii → accent (#155e75)
	const accentColor = isChild ? '#155e75' : '#c13333';
	const accentBg = isChild ? '#cffafe' : '#fef2f2';
	const bookingUrl = specialtyParam ? `/programare?specialty=${specialtyParam}` : '/programare';
</script>

<svelte:head>
	<title>{title} - Clinica Sf. Gherasim</title>
	<meta name="description" content={heroDescription} />
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-16 md:py-20">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto">
				<!-- Breadcrumb -->
				<nav class="flex items-center gap-2 text-sm text-gray-600 mb-6">
					<a href="/" class="hover:text-[#c13333] transition-colors">Acasă</a>
					<span class="text-gray-400">/</span>
					<a href="/ce-tratam" class="hover:text-[#c13333] transition-colors">Ce Tratăm</a>
					<span class="text-gray-400">/</span>
					<span class="text-gray-900 font-medium">{title}</span>
				</nav>

				<!-- Category badge -->
				<span
					class="inline-block text-xs font-bold uppercase tracking-[0.16em] text-white px-3.5 py-1.5 rounded-full mb-5"
					style="background: {accentColor};"
				>
					{categoryLabel}
				</span>

				<h1
					class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.05] mb-4"
				>
					{title}
				</h1>

				<p class="text-xl text-gray-700 leading-tight mb-6 font-medium">{subtitle}</p>

				<p class="text-lg text-gray-600 leading-[1.7] mb-8">{heroDescription}</p>

				<a
					href={bookingUrl}
					class="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-3.5 rounded transition-opacity hover:opacity-90"
					style="background: {accentColor};"
				>
					<Icon name="calendar" size="16" />
					{ctaText}
				</a>
			</div>
		</div>
	</section>

	<!-- SYMPTOMS (white) -->
	<section class="bg-white py-20 md:py-24 border-y border-gray-200">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto">
				<div class="mb-10">
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px" style="background: {accentColor};"></span>
						<span
							class="text-xs font-bold uppercase tracking-[0.18em]"
							style="color: {accentColor};"
						>
							Semne și Simptome
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
						Cum se <span style="color: {accentColor};">manifestă</span>
					</h2>
				</div>

				<ul class="grid sm:grid-cols-2 gap-3">
					{#each symptoms as symptom}
						<li
							class="flex items-start gap-3 bg-[#f8f9fa] border border-gray-200 rounded p-4"
						>
							<span
								class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white mt-0.5"
								style="background: {accentColor};"
							>
								<Icon name="check" size="14" />
							</span>
							<span class="text-base text-gray-700 leading-[1.6]">{symptom}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- WHEN TO SEEK HELP (DARK + glow) -->
	<section class="bg-gray-900 py-20 md:py-24 text-white relative overflow-hidden">
		<div
			class="absolute -top-52 -right-24 w-96 h-96 rounded-full blur-[80px] opacity-[0.12]"
			style="background: {accentColor};"
		></div>
		<div class="container-custom relative z-10">
			<div class="max-w-3xl mx-auto">
				<div class="mb-10">
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-white/40"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
							Când să Cereți Ajutor
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
						Semne care merită <span style="color: {accentColor};">atenție</span>
					</h2>
					<p class="text-lg text-white/75 leading-[1.65] max-w-2xl">
						Este important să solicitați o evaluare profesională dacă observați la dumneavoastră
						sau la cei dragi:
					</p>
				</div>

				<ul class="flex flex-col gap-3">
					{#each whenToSeekHelp as item}
						<li
							class="flex items-start gap-3 bg-white/[0.04] border border-white/10 rounded p-5"
						>
							<span
								class="flex-shrink-0 w-2 h-2 rounded-full mt-2.5"
								style="background: {accentColor};"
							></span>
							<span class="text-base text-white/90 leading-[1.65]">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- TREATMENTS (white) -->
	<section class="bg-white py-20 md:py-24 border-b border-gray-200">
		<div class="container-custom">
			<div class="max-w-4xl mx-auto">
				<div class="mb-12">
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px" style="background: {accentColor};"></span>
						<span
							class="text-xs font-bold uppercase tracking-[0.18em]"
							style="color: {accentColor};"
						>
							Abordări Terapeutice
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
						Cum <span style="color: {accentColor};">tratăm</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.65] max-w-2xl">
						Fiecare plan de tratament este personalizat. În funcție de evaluare, putem combina mai
						multe abordări pentru rezultate optime.
					</p>
				</div>

				<div class="grid md:grid-cols-2 gap-5">
					{#each treatments as treatment}
						<div
							class="bg-white rounded p-6 border border-gray-200 transition-all hover:shadow-lg"
							style="border-top: 3px solid {accentColor};"
						>
							<h3 class="text-xl font-extrabold text-gray-900 mb-2.5 leading-tight">
								{treatment.name}
							</h3>
							<p class="text-base text-gray-600 leading-[1.65]">{treatment.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- SPECIALISTS + RELATED (split, off-white) -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="max-w-4xl mx-auto">
				<div class="grid md:grid-cols-2 gap-12">
					<!-- Specialists -->
					<div>
						<div class="flex items-center gap-2.5 mb-3">
							<span class="w-7 h-px" style="background: {accentColor};"></span>
							<span
								class="text-xs font-bold uppercase tracking-[0.18em]"
								style="color: {accentColor};"
							>
								Echipa Implicată
							</span>
						</div>
						<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
							Specialiști <span style="color: {accentColor};">recomandați</span>
						</h2>
						<p class="text-base text-gray-600 leading-[1.65] mb-6">
							Pentru această afecțiune lucrăm de obicei în echipă multidisciplinară:
						</p>

						<ul class="flex flex-col gap-2.5 mb-6">
							{#each specialists as specialist}
								<li class="flex items-center gap-3 bg-white border border-gray-200 rounded p-3.5">
									<span
										class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
										style="background: {accentBg}; color: {accentColor};"
									>
										<Icon name="user" size="16" />
									</span>
									<span class="text-base text-gray-800 font-medium">{specialist}</span>
								</li>
							{/each}
						</ul>

						<a
							href="/clinica#echipa"
							class="inline-flex items-center gap-1.5 font-semibold text-base hover:opacity-80 transition-opacity"
							style="color: {accentColor};"
						>
							Vezi toți specialiștii
							<Icon name="arrow-right" size="14" />
						</a>
					</div>

					<!-- Related problems -->
					{#if relatedProblems.length > 0}
						<div>
							<div class="flex items-center gap-2.5 mb-3">
								<span class="w-7 h-px" style="background: {accentColor};"></span>
								<span
									class="text-xs font-bold uppercase tracking-[0.18em]"
									style="color: {accentColor};"
								>
									Afecțiuni Conexe
								</span>
							</div>
							<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
								Citește și <span style="color: {accentColor};">despre</span>
							</h2>
							<p class="text-base text-gray-600 leading-[1.65] mb-6">
								Adesea aceste afecțiuni apar împreună sau au simptome similare:
							</p>

							<ul class="flex flex-col gap-2.5">
								{#each relatedProblems as problem}
									<li>
										<a
											href={problem.href}
											class="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
										>
											<span class="text-base font-semibold text-gray-900">{problem.title}</span>
											<span style="color: {accentColor};">
												<Icon name="arrow-right" size="16" />
											</span>
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

	<!-- HELP CALLOUT -->
	<section class="bg-white py-14 border-t border-gray-200">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto">
				<div
					class="rounded p-8 md:p-9 flex flex-col sm:flex-row gap-6 items-start"
					style="background: #cffafe; border: 1px solid #155e7540;"
				>
					<div
						class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white"
						style="background: #155e75;"
					>
						<Icon name="phone" size="20" />
					</div>
					<div class="flex-1">
						<h2 class="text-xl md:text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
							Aveți întrebări despre {title.toLowerCase()}?
						</h2>
						<p class="text-base text-gray-700 leading-[1.7] mb-4">
							Înțelegem că poate fi greu să luați primul pas. Sunați-ne și vă vom asculta — fără
							angajament, fără costuri. Vă vom explica ce putem face și care sunt următorii pași
							potriviți pentru situația dumneavoastră.
						</p>
						<div class="flex flex-wrap gap-3">
							<a
								href="tel:+40376501501"
								class="inline-flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded transition-opacity hover:opacity-90"
								style="background: #155e75;"
							>
								<Icon name="phone" size="15" />
								Sunați-ne: +40 376 501 501
							</a>
							<a
								href="/contact"
								class="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded border-2 transition-colors hover:bg-[#155e75] hover:text-white"
								style="color: #155e75; border-color: #155e7540;"
							>
								Trimite o întrebare
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-20 text-white" style="background: {accentColor};">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.15]">
					Primul pas către vindecare
				</h2>
				<p class="text-lg leading-[1.65] opacity-90 mb-8">
					Nu sunteți singur. Programați o evaluare și începeți drumul către un plan de tratament
					personalizat, alături de specialiștii noștri.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href={bookingUrl}
						class="inline-flex items-center gap-2 bg-white hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded transition-colors"
						style="color: {accentColor};"
					>
						<Icon name="calendar" size="16" />
						{ctaText}
					</a>
					<a
						href="/contact"
						class="inline-flex items-center gap-2 border-2 border-white/50 text-white hover:bg-white/10 font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						Contactează-ne
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
