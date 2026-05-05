<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { getProblemsByCategory } from '$lib/data/problems';

	let { data } = $props();

	type Card = {
		slug: string;
		title: string;
		category: 'copii' | 'adulti';
		icon?: string;
		shortDescription: string;
	};

	const allCards: Card[] = data.cms?.length
		? data.cms.map((p: Card) => ({
				slug: p.slug,
				title: p.title,
				category: p.category,
				icon: p.icon,
				shortDescription: p.shortDescription
			}))
		: [
				...getProblemsByCategory('copii').map((p) => ({
					slug: p.slug,
					title: p.title,
					category: 'copii' as const,
					icon: p.icon,
					shortDescription: p.shortDescription
				})),
				...getProblemsByCategory('adulti').map((p) => ({
					slug: p.slug,
					title: p.title,
					category: 'adulti' as const,
					icon: p.icon,
					shortDescription: p.shortDescription
				}))
			];

	const problemsCopii = allCards.filter((p) => p.category === 'copii');
	const problemsAdulti = allCards.filter((p) => p.category === 'adulti');

	function safeIcon(name?: string): 'brain' | 'heart' | 'child' | 'user' {
		if (name === 'heart' || name === 'child' || name === 'user') return name;
		return 'brain';
	}
</script>

<svelte:head>
	<title>Ce Tratăm - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Tratăm o gamă largă de tulburări psihice pentru copii și adulți: autism, ADHD, anxietate, depresie, tulburări de somn și multe altele. Diagnostic și plan personalizat."
	/>
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto text-center">
				<div class="flex items-center justify-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Ce Tratăm
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h1
					class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6"
				>
					Afecțiuni <span class="text-[#c13333]">tratate</span>
				</h1>
				<p class="text-lg text-gray-700 leading-[1.65] max-w-2xl mx-auto">
					Suntem specializați în diagnosticul și tratamentul tulburărilor de sănătate mentală — pentru
					copii și pentru adulți. Fiecare pacient primește un plan personalizat, pornind de la o
					evaluare profesională.
				</p>
			</div>
		</div>
	</section>

	<!-- COPII (off-white card section) -->
	<section id="copii" class="bg-white py-20 md:py-24 border-y border-gray-200 scroll-mt-20">
		<div class="container-custom">
			<div class="max-w-5xl mx-auto">
				<div class="mb-12">
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Pentru Copii și Adolescenți
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
						Îngrijire <span class="text-[#c13333]">specializată</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.65] max-w-2xl">
						Copilăria este o perioadă critică. Intervențiile timpurii pot face o diferență
						semnificativă. Echipa noastră oferă evaluări complete și planuri de tratament adaptate
						vârstei și nevoilor fiecărui copil.
					</p>
				</div>

				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each problemsCopii as p}
						<a
							href="/ce-tratam/{p.slug}"
							class="flex gap-4 items-start bg-white rounded p-5 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
						>
							<div
								class="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center mt-0.5"
								style="background: #cffafe; color: #155e75;"
							>
								<Icon name={safeIcon(p.icon)} size="18" />
							</div>
							<div>
								<div class="text-base font-bold text-gray-900 mb-1.5">{p.title}</div>
								<div class="text-sm text-gray-600 leading-[1.6] mb-2.5">
									{p.shortDescription}
								</div>
								<span
									class="inline-block text-xs font-bold text-white px-2.5 py-0.5 rounded-full"
									style="background: #155e75;"
								>
									Copii
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ADULȚI (off-white) -->
	<section id="adulti" class="bg-[#f8f9fa] py-20 md:py-24 scroll-mt-20">
		<div class="container-custom">
			<div class="max-w-5xl mx-auto">
				<div class="mb-12">
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#c13333]"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#c13333]">
							Pentru Adulți
						</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
						Suport <span class="text-[#c13333]">profesional</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.65] max-w-2xl">
						Viața adultă vine cu propriile provocări — stres, anxietate, depresie, probleme de
						somn. Nu trebuie să le înfrunți singur. Oferim un spațiu sigur și confidențial pentru a
						primi ajutorul de care ai nevoie.
					</p>
				</div>

				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each problemsAdulti as p}
						<a
							href="/ce-tratam/{p.slug}"
							class="flex gap-4 items-start bg-white rounded p-5 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
						>
							<div
								class="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center mt-0.5"
								style="background: #fef2f2; color: #c13333;"
							>
								<Icon name={safeIcon(p.icon)} size="18" />
							</div>
							<div>
								<div class="text-base font-bold text-gray-900 mb-1.5">{p.title}</div>
								<div class="text-sm text-gray-600 leading-[1.6] mb-2.5">
									{p.shortDescription}
								</div>
								<span
									class="inline-block text-xs font-bold text-white px-2.5 py-0.5 rounded-full"
									style="background: #c13333;"
								>
									Adulți
								</span>
							</div>
						</a>
					{/each}
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
							Nu sunteți sigur de unde să începeți?
						</h2>
						<p class="text-base text-gray-700 leading-[1.7] mb-4">
							Lista nu este exhaustivă. Dacă observați semne îngrijorătoare la dumneavoastră sau la
							copilul dumneavoastră — chiar și nelistate aici — vă invităm să ne sunați. Vă vom
							asculta și vă vom îndruma către specialistul potrivit.
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
	<section class="bg-[#c13333] py-20 text-white">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.15]">
					Primul pas către vindecare
				</h2>
				<p class="text-lg leading-[1.65] opacity-90 mb-8">
					Nu sunteți singur în această călătorie. Echipa noastră de specialiști vă poate ajuta să
					înțelegeți mai bine situația și să găsiți cele mai potrivite soluții.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href="/programare"
						class="inline-flex items-center gap-2 bg-white text-[#c13333] hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						<Icon name="calendar" size="16" />
						Programează o evaluare
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
