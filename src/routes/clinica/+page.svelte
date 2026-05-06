<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';
	import { CATEGORY_CONFIG, type DoctorCategory } from '$lib/sanity/categories';

	let { data } = $props();
	const about = data.about;
	const specialists = data.specialists;

	// Hero
	const fallbackHeroTitle = 'Despre Clinica Sf. Gherasim';
	const fallbackHeroAccent = 'Sf. Gherasim';
	const fallbackHeroLead =
		'Suntem o echipă de profesioniști dedicată sănătății mentale — pentru copii, adolescenți și adulți. Diagnostic riguros, tratament personalizat, abordare empatică.';

	const heroTitle = about?.heroTitle ?? fallbackHeroTitle;
	const heroAccent = about?.heroTitleAccent ?? fallbackHeroAccent;
	const heroLead = about?.heroLead ?? fallbackHeroLead;

	// Story
	const fallbackStoryEyebrow = 'Povestea noastră';
	const fallbackStoryTitle = 'De ce am pornit la drum';
	const storyEyebrow = about?.storyEyebrow ?? fallbackStoryEyebrow;
	const storyTitle = about?.storyTitle ?? fallbackStoryTitle;

	// Foundations
	const fallbackFoundationsEyebrow = 'Misiune · Viziune · Principii';
	const fallbackFoundationsTitle = 'Ce ne motivează';
	const fallbackMission =
		'Oferim îngrijire psihiatrică și psihologică modernă, accesibilă, bazată pe ghiduri clinice internaționale. Fiecare pacient primește un plan personalizat, cu urmărire atentă.';
	const fallbackVision =
		'Devenim un punct de referință pentru sănătatea mentală în regiune — un loc unde pacienții și familiile lor primesc răspunsuri clare, sprijin real și speranță concretă.';

	const foundationsEyebrow = about?.foundationsEyebrow ?? fallbackFoundationsEyebrow;
	const foundationsTitle = about?.foundationsTitle ?? fallbackFoundationsTitle;
	const missionText = about?.missionText ?? fallbackMission;
	const visionText = about?.visionText ?? fallbackVision;

	const fallbackPrinciples = [
		{
			iconName: 'heart',
			title: 'Empatie înainte de toate',
			description: 'Fiecare pacient e ascultat cu atenție, fără judecată — un spațiu sigur pentru a vorbi despre orice.'
		},
		{
			iconName: 'brain',
			title: 'Expertiză verificată',
			description: 'Specialiști cu formare continuă, instrumente standardizate la nivel internațional, decizii bazate pe dovezi.'
		},
		{
			iconName: 'check',
			title: 'Plan personalizat',
			description: 'Niciun caz nu e identic. Fiecare plan de tratament e adaptat nevoilor unice ale pacientului și familiei.'
		},
		{
			iconName: 'user',
			title: 'Echipă multidisciplinară',
			description: 'Psihiatri, psihologi, psihoterapeuți, logopezi — colaborăm pentru a oferi îngrijire completă.'
		}
	];

	const principles =
		about?.principles && about.principles.length > 0 ? about.principles : fallbackPrinciples;

	function safeIcon(name?: string): 'brain' | 'heart' | 'check' | 'user' | 'calendar' | 'phone' | 'email' {
		if (
			name === 'brain' ||
			name === 'heart' ||
			name === 'check' ||
			name === 'user' ||
			name === 'calendar' ||
			name === 'phone' ||
			name === 'email'
		) {
			return name;
		}
		return 'check';
	}

	// Team filter
	const presentCategories: DoctorCategory[] = Array.from(
		new Set(specialists.map((s) => s.category))
	)
		.filter((cat): cat is DoctorCategory => !!cat && cat in CATEGORY_CONFIG)
		.sort((a, b) => CATEGORY_CONFIG[a].order - CATEGORY_CONFIG[b].order);

	let activeCategory = $state<DoctorCategory | 'all'>('all');

	const filteredSpecialists = $derived(
		activeCategory === 'all'
			? specialists
			: specialists.filter((s) => s.category === activeCategory)
	);

	function bookingHref(s: { id: string }): string {
		return s.id ? `/programare?doctor=${s.id}` : '/programare';
	}

	function categoryAccent(cat: DoctorCategory): string {
		// Soft mapping to new design palette: red for psihiatru, teal for others
		return cat === 'psihiatru' ? '#c13333' : '#155e75';
	}
</script>

<svelte:head>
	<title>{heroTitle} - Clinica Sf. Gherasim</title>
	<meta name="description" content={heroLead} />
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto text-center">
				<div class="flex items-center justify-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Clinica
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h1
					class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6"
				>
					{#if heroAccent && heroTitle.includes(heroAccent)}
						{@const parts = heroTitle.split(heroAccent)}
						{parts[0]}<span class="text-[#c13333]">{heroAccent}</span>{parts[1] ?? ''}
					{:else}
						{heroTitle}
					{/if}
				</h1>
				<p class="text-lg text-gray-700 leading-[1.65] max-w-2xl mx-auto">{heroLead}</p>
			</div>
		</div>
	</section>

	<!-- STORY -->
	<section class="bg-white py-20 md:py-24 border-y border-gray-200">
		<div class="container-custom max-w-3xl">
			<div class="mb-10">
				<div class="flex items-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						{storyEyebrow}
					</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
					{storyTitle}
				</h2>
			</div>

			{#if about?.storyBody && about.storyBody.length > 0}
				<div class="text-lg text-gray-700 leading-[1.7] space-y-5">
					<PortableBody value={about.storyBody} />
				</div>
			{:else}
				<div class="text-lg text-gray-700 leading-[1.7] space-y-5">
					<p>
						Clinica Sf. Gherasim — PSIMED a luat naștere din nevoia de a oferi în Bacău o
						alternativă serioasă, modernă și empatică în domeniul sănătății mentale. De la prima
						consultație până la planul de intervenție, fiecare pacient primește atenție completă.
					</p>
					<p>
						Lucrăm cu instrumente standardizate la nivel internațional și colaborăm strâns ca
						echipă — psihiatri, psihologi, psihoterapeuți, logopezi — pentru a oferi îngrijire
						integrată copiilor, adolescenților și adulților.
					</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- TEAM (Echipa) -->
	<section id="echipa" class="bg-[#f8f9fa] py-20 md:py-24 scroll-mt-20">
		<div class="container-custom">
			<div class="max-w-6xl mx-auto">
				<div class="text-center mb-12">
					<div class="flex items-center justify-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Echipa Noastră
						</span>
						<span class="w-7 h-px bg-[#155e75]"></span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
						Specialiști cu <span class="text-[#c13333]">vocație</span>
					</h2>
					<p class="text-lg text-gray-700 leading-[1.65] max-w-2xl mx-auto">
						Reunim psihiatri, psihologi, psihoterapeuți și logopezi cu formare continuă — fiecare
						pacient beneficiază de expertiza întregii echipe.
					</p>
				</div>

				<!-- Category filter -->
				{#if presentCategories.length > 1}
					<div class="flex flex-wrap justify-center gap-2 mb-10">
						<button
							type="button"
							class="px-4 py-2 rounded-full text-sm font-bold transition-all border"
							style={activeCategory === 'all'
								? 'background: #c13333; color: white; border-color: #c13333;'
								: 'background: white; color: #1f2937; border-color: #e5e7eb;'}
							onclick={() => (activeCategory = 'all')}
						>
							Toți ({specialists.length})
						</button>
						{#each presentCategories as cat}
							{@const count = specialists.filter((s) => s.category === cat).length}
							{@const isActive = activeCategory === cat}
							{@const accent = categoryAccent(cat)}
							<button
								type="button"
								class="px-4 py-2 rounded-full text-sm font-bold transition-all border"
								style={isActive
									? `background: ${accent}; color: white; border-color: ${accent};`
									: 'background: white; color: #1f2937; border-color: #e5e7eb;'}
								onclick={() => (activeCategory = cat)}
							>
								{CATEGORY_CONFIG[cat].label} ({count})
							</button>
						{/each}
					</div>
				{/if}

				<!-- Doctor grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{#each filteredSpecialists as s}
						{@const accent = categoryAccent(s.category)}
						<a
							href={bookingHref(s)}
							class="group flex flex-col bg-white rounded border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all"
						>
							<div class="aspect-square overflow-hidden relative bg-gradient-to-br from-[#cffafe] to-[#fef2f2]">
								{#if s.image}
									<img
										src={s.image}
										alt={s.name}
										class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-400">
										<Icon name="user" size="56" />
									</div>
								{/if}
								<div class="absolute top-3 left-3">
									<span
										class="text-white text-xs font-bold px-2.5 py-1 rounded-full shadow"
										style="background: {accent};"
									>
										{CATEGORY_CONFIG[s.category]?.label ?? s.category}
									</span>
								</div>
							</div>
							<div class="p-4 flex flex-col flex-1">
								<h3 class="text-base font-extrabold text-gray-900 mb-1 leading-tight">
									{s.name}
								</h3>
								<p class="text-sm font-semibold mb-3" style="color: {accent};">{s.title}</p>
								<p class="text-sm text-gray-600 leading-[1.55] mb-3 line-clamp-3">
									{s.description}
								</p>
								<div class="flex flex-wrap gap-1.5 mt-auto">
									{#each s.specialties.slice(0, 2) as sp}
										<span
											class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
										>
											{sp}
										</span>
									{/each}
									{#if s.specialties.length > 2}
										<span class="px-2 py-0.5 text-gray-500 text-xs">
											+{s.specialties.length - 2}
										</span>
									{/if}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- FOUNDATIONS (Mission + Vision + Principles, DARK + glow) -->
	<section class="bg-gray-900 py-20 md:py-24 text-white relative overflow-hidden">
		<div
			class="absolute -top-52 -right-24 w-96 h-96 rounded-full blur-[80px] opacity-[0.12]"
			style="background: #c13333;"
		></div>
		<div
			class="absolute -bottom-36 -left-24 w-[350px] h-[350px] rounded-full blur-[80px] opacity-[0.15]"
			style="background: #155e75;"
		></div>

		<div class="container-custom relative z-10 max-w-5xl">
			<div class="text-center mb-14">
				<div class="flex items-center justify-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#c13333]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
						{foundationsEyebrow}
					</span>
					<span class="w-7 h-px bg-[#c13333]"></span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight">
					{foundationsTitle}
				</h2>
			</div>

			<!-- Mission + Vision -->
			<div class="grid md:grid-cols-2 gap-6 mb-14">
				<div class="bg-white/[0.04] rounded p-7 border border-white/10">
					<div class="flex items-center gap-3 mb-4">
						<span
							class="w-10 h-10 rounded-full flex items-center justify-center text-white"
							style="background: #c13333;"
						>
							<Icon name="heart" size="18" />
						</span>
						<h3 class="text-2xl font-extrabold text-white">Misiune</h3>
					</div>
					<p class="text-base text-white/85 leading-[1.7]">{missionText}</p>
				</div>
				<div class="bg-white/[0.04] rounded p-7 border border-white/10">
					<div class="flex items-center gap-3 mb-4">
						<span
							class="w-10 h-10 rounded-full flex items-center justify-center text-white"
							style="background: #155e75;"
						>
							<Icon name="brain" size="18" />
						</span>
						<h3 class="text-2xl font-extrabold text-white">Viziune</h3>
					</div>
					<p class="text-base text-white/85 leading-[1.7]">{visionText}</p>
				</div>
			</div>

			<!-- Principles -->
			{#if principles.length > 0}
				<div class="border-t border-white/10 pt-12">
					<h3 class="text-2xl md:text-3xl font-extrabold text-white text-center mb-10">
						Principii
					</h3>
					<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
						{#each principles as principle}
							<div class="bg-white/[0.04] rounded p-6 border border-white/10">
								<div
									class="w-11 h-11 rounded flex items-center justify-center mb-4"
									style="background: rgba(193, 51, 51, 0.15); color: #c13333;"
								>
									<Icon name={safeIcon(principle.iconName)} size="22" />
								</div>
								<h4 class="text-base font-extrabold text-white mb-2 leading-tight">
									{principle.title}
								</h4>
								{#if principle.description}
									<p class="text-sm text-white/75 leading-[1.65]">{principle.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- CTA -->
	<section class="bg-[#c13333] py-20 text-white">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.15]">
					Hai să te cunoaștem
				</h2>
				<p class="text-lg leading-[1.65] opacity-90 mb-8">
					Programează o consultație și descoperă cum te putem ajuta. Fiecare poveste contează —
					fiecare pacient primește atenția echipei întregi.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href="/programare"
						class="inline-flex items-center gap-2 bg-white text-[#c13333] hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						<Icon name="calendar" size="16" />
						Programează o consultație
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
