<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	let { data } = $props();
	const featuredDoctors = data.featuredDoctors;
	const featuredConditions = data.featuredConditions;

	const trustPillars = [
		{
			icon: 'heart' as const,
			title: 'Empatie înainte de toate',
			desc: 'Fiecare pacient este ascultat cu atenție. Creăm un spațiu sigur, fără judecată.'
		},
		{
			icon: 'brain' as const,
			title: 'Expertiză clinică verificată',
			desc: 'Specialiști cu formare continuă, utilizând metode validate științific.'
		},
		{
			icon: 'check' as const,
			title: 'Rezultate dovedite',
			desc: 'Planuri de tratament personalizate, cu urmărire atentă a progresului.'
		}
	];

	const services = [
		{
			icon: 'user' as const,
			title: 'Psihiatrie Adulți',
			desc: 'Diagnostic și tratament pentru tulburări psihiatrice la adulți, abordare personalizată.',
			accent: 'primary' as const,
			href: '/servicii-si-preturi'
		},
		{
			icon: 'heart' as const,
			title: 'Psihiatrie Pediatrică',
			desc: 'Îngrijire specializată pentru copii și adolescenți, în colaborare cu familia.',
			accent: 'teal' as const,
			href: '/psihologie-pediatrica'
		},
		{
			icon: 'brain' as const,
			title: 'Psihologie Clinică',
			desc: 'Evaluări psihologice complete cu instrumente gold-standard și consiliere.',
			accent: 'primary' as const,
			href: '/servicii-si-preturi'
		},
		{
			icon: 'heart' as const,
			title: 'Psihoterapie',
			desc: 'Terapie individuală și de grup pentru diverse provocări emoționale.',
			accent: 'teal' as const,
			href: '/servicii-si-preturi'
		},
		{
			icon: 'brain' as const,
			title: 'Neurofeedback',
			desc: 'Tratament modern pentru ADHD, anxietate și alte tulburări neurologice.',
			accent: 'primary' as const,
			href: '/servicii-si-preturi'
		},
		{
			icon: 'brain' as const,
			title: 'Hipnoză Clinică',
			desc: 'Terapie prin hipnoză pentru diverse afecțiuni, în context clinic riguros.',
			accent: 'teal' as const,
			href: '/servicii-si-preturi'
		}
	];

	const stats = [
		{ value: '15+', label: 'Ani experiență' },
		{ value: '5000+', label: 'Pacienți ajutați' },
		{ value: '95%', label: 'Satisfacție' }
	];

	const testimonials = [
		{
			name: 'M.I.',
			role: 'Pacientă, terapie pentru anxietate',
			text: 'Am venit cu multă reticență, dar echipa m-a primit cu căldură. După 6 luni de terapie, mă simt o altă persoană. Recomand cu toată inima.'
		},
		{
			name: 'T.A.',
			role: 'Părinte, copil cu ADHD',
			text: 'Fiul meu a progresat incredibil datorită specialiștilor de la Psimed. Sunt profesioniști adevărați, dar și oameni empatici și răbdători.'
		},
		{
			name: 'C.D.',
			role: 'Pacient, tratament depresie',
			text: 'Clinica Sf. Gherasim mi-a schimbat viața. Abordarea personalizată și urmărirea atentă a fiecărui pas au făcut toată diferența.'
		}
	];

	const trustBadges = ['15+ ani experiență', 'Tratamente moderne', 'Echipă dedicată'];
</script>

<svelte:head>
	<title>Clinica Sf. Gherasim - PSIMED Bacău | Psihiatrie & Psihologie</title>
	<meta
		name="description"
		content="Clinică de psihiatrie și psihologie în Bacău. Tratamente moderne pentru sănătate mentală: psihiatrie adulți și pediatrică, psihoterapie, neurofeedback, evaluări psihologice."
	/>
</svelte:head>

<div class="font-['Plus_Jakarta_Sans']">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
				<div>
					<span
						class="inline-block text-xs font-bold uppercase tracking-[0.12em] text-[#155e75] mb-5"
					>
						Psihiatrie · Psihologie · Psihoterapie
					</span>
					<h1
						class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-5"
					>
						Îngrijire<br />
						<span class="text-[#c13333]">Psihiatrică</span><br />
						de Încredere
					</h1>
					<p class="text-lg text-gray-600 leading-[1.7] mb-9 max-w-md">
						Oferim tratamente moderne și personalizate pentru sănătatea ta mentală. Echipa noastră
						de specialiști îți stă alături cu profesionalism și empatie.
					</p>
					<div class="flex flex-wrap gap-3 mb-10">
						<a
							href="/programare"
							class="inline-flex items-center gap-2 bg-[#c13333] hover:bg-[#a52828] text-white font-bold text-base px-8 py-3.5 rounded transition-colors"
						>
							<Icon name="calendar" size="16" />
							Programează consultație
						</a>
						<a
							href="/ce-tratam"
							class="inline-flex items-center gap-2 border-2 border-[#155e75] text-[#155e75] hover:bg-[#155e75] hover:text-white font-bold text-base px-8 py-3.5 rounded transition-colors"
						>
							Ce tratăm
							<Icon name="arrow-right" size="16" />
						</a>
					</div>
					<div class="flex flex-wrap gap-3">
						{#each trustBadges as badge}
							<div
								class="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded px-3.5 py-1.5 shadow-sm"
							>
								<span class="text-[#155e75]">
									<Icon name="check" size="14" />
								</span>
								<span class="text-sm font-semibold text-gray-900">{badge}</span>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<div
						class="aspect-[4/3] bg-gradient-to-br from-[#cffafe] to-[#fef2f2] rounded flex items-center justify-center border border-gray-200"
					>
						<span class="text-sm text-gray-500 text-center px-6">
							fotografie clinică · echipă medicală · spații prietenoase
						</span>
					</div>
					<div class="grid grid-cols-3 gap-3">
						{#each stats as stat}
							<div class="bg-white border border-gray-200 rounded p-4 text-center">
								<div class="text-3xl font-extrabold text-[#c13333] leading-none">
									{stat.value}
								</div>
								<div class="text-xs text-gray-600 mt-1">{stat.label}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- TRUST PILLARS -->
	<section class="bg-gray-900 py-14">
		<div class="container-custom">
			<div class="grid md:grid-cols-3 gap-10">
				{#each trustPillars as pillar, i}
					<div
						class="flex flex-col gap-3.5 px-2 {i > 0
							? 'md:pl-10 md:border-l md:border-white/10'
							: ''}"
					>
						<div class="text-[#c13333]">
							<Icon name={pillar.icon} size="28" />
						</div>
						<h3 class="text-xl font-extrabold text-white">{pillar.title}</h3>
						<p class="text-base text-white/75 leading-[1.7]">{pillar.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SERVICES -->
	<section class="bg-white py-20 md:py-24 border-y border-gray-200">
		<div class="container-custom">
			<div class="mb-12">
				<div class="flex items-center gap-2.5 mb-2.5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Serviciile Noastre
					</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
					Îngrijire Completă pentru
					<span class="text-[#c13333]">Sănătatea Ta</span>
				</h2>
			</div>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each services as svc}
					{@const c = svc.accent === 'primary' ? '#c13333' : '#155e75'}
					{@const cl = svc.accent === 'primary' ? '#fef2f2' : '#cffafe'}
					<a
						href={svc.href}
						class="group block bg-white rounded p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
						style="border-top: 3px solid {c};"
					>
						<div
							class="w-11 h-11 rounded flex items-center justify-center mb-4"
							style="background: {cl}; color: {c};"
						>
							<Icon name={svc.icon} size="22" />
						</div>
						<h3 class="text-xl font-extrabold text-gray-900 mb-2">{svc.title}</h3>
						<p class="text-base text-gray-600 leading-[1.65] mb-4">{svc.desc}</p>
						<span
							class="inline-flex items-center gap-1 text-sm font-semibold"
							style="color: {c};"
						>
							Află mai mult
							<Icon name="arrow-right" size="13" />
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- CONDITIONS -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
				<div>
					<div class="flex items-center gap-2.5 mb-2.5">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Ce Tratăm
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
						Afecțiuni <span class="text-[#c13333]">Frecvente</span>
					</h2>
				</div>
				<a
					href="/ce-tratam"
					class="inline-flex items-center gap-2 border-2 border-[#c13333] text-[#c13333] hover:bg-[#c13333] hover:text-white font-bold text-sm px-5 py-2.5 rounded transition-colors self-start"
				>
					Vezi toate
					<Icon name="arrow-right" size="13" />
				</a>
			</div>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each featuredConditions as condition}
					{@const isChild = condition.category === 'copii'}
					{@const c = isChild ? '#155e75' : '#c13333'}
					{@const cl = isChild ? '#cffafe' : '#fef2f2'}
					<a
						href="/ce-tratam/{condition.slug}"
						class="flex gap-4 items-start bg-white rounded p-5 border border-gray-200 hover:shadow-lg transition-shadow"
					>
						<div
							class="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center mt-0.5"
							style="background: {cl}; color: {c};"
						>
							<Icon name={(condition.icon as 'brain' | 'heart' | 'child' | 'user') ?? 'brain'} size="16" />
						</div>
						<div>
							<div class="text-base font-bold text-gray-900 mb-1">{condition.title}</div>
							<div class="text-sm text-gray-600 leading-[1.6] mb-2">
								{condition.shortDescription}
							</div>
							<span
								class="inline-block text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full"
								style="background: {c};"
							>
								{isChild ? 'Copii' : 'Adulți'}
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- TESTIMONIALS -->
	<section class="bg-gray-900 py-20 md:py-24 text-white relative overflow-hidden">
		<div
			class="absolute -top-52 -right-24 w-96 h-96 rounded-full blur-[80px] opacity-[0.12]"
			style="background: #c13333;"
		></div>
		<div
			class="absolute -bottom-36 -left-24 w-[350px] h-[350px] rounded-full blur-[80px] opacity-[0.15]"
			style="background: #155e75;"
		></div>

		<div class="container-custom relative z-10">
			<div class="text-center mb-14">
				<div class="flex items-center justify-center gap-2.5 mb-2.5">
					<span class="w-7 h-px bg-[#c13333]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
						Ce Spun Pacienții
					</span>
					<span class="w-7 h-px bg-[#c13333]"></span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight">
					Povești de <span class="text-[#c13333]">Recuperare</span>
				</h2>
			</div>
			<div class="grid md:grid-cols-3 gap-6">
				{#each testimonials as t}
					<div class="bg-white/[0.04] rounded p-8 relative border border-white/10">
						<div class="flex gap-0.5 mb-4">
							{#each [1, 2, 3, 4, 5] as _}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="#fbbf24"
									aria-hidden="true"
								>
									<polygon
										points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"
									/>
								</svg>
							{/each}
						</div>
						<p class="text-base text-white/90 leading-[1.75] mb-5">{t.text}</p>
						<div class="border-t border-white/10 pt-4">
							<div class="text-base font-bold text-white">{t.name}</div>
							<div class="text-sm text-white/70">{t.role}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SPECIALISTS TEASER -->
	<section class="bg-white py-20 md:py-24 border-b border-gray-200">
		<div class="container-custom">
			<div class="grid lg:grid-cols-[1fr_1.4fr] gap-14 items-center">
				<div>
					<div class="flex items-center gap-2.5 mb-2.5">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Echipa Noastră
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
						Specialiști cu <span class="text-[#c13333]">Vocație</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.7] mb-7">
						Echipa noastră reunește psihiatri, psihologi și psihoterapeuți cu formare continuă și
						experiență clinică bogată.
					</p>
					<a
						href="/specialisti"
						class="inline-flex items-center gap-2 bg-[#c13333] hover:bg-[#a52828] text-white font-bold text-base px-7 py-3 rounded transition-colors"
					>
						Cunoaște echipa
						<Icon name="arrow-right" size="15" />
					</a>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
					{#each featuredDoctors as doc}
						<div class="bg-white rounded overflow-hidden shadow-sm border border-gray-200">
							<div class="aspect-square bg-gradient-to-br from-[#cffafe] to-[#fef2f2]">
								{#if doc.image}
									<img src={doc.image} alt={doc.name} class="w-full h-full object-cover" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-400">
										<Icon name="user" size="40" />
									</div>
								{/if}
							</div>
							<div class="p-3">
								<div class="text-sm font-bold text-gray-900 mb-0.5 truncate">{doc.name}</div>
								<div class="text-xs text-gray-600 capitalize truncate">{doc.title}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="bg-[#c13333] py-20">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<h2 class="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
					Fă primul pas astăzi
				</h2>
				<p class="text-lg text-white/85 mb-9 leading-[1.65]">
					Programează o consultație și descoperă cum te putem ajuta să îți regăsești echilibrul.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href="/programare"
						class="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#c13333] font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						<Icon name="calendar" size="16" />
						Programează-te acum
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
