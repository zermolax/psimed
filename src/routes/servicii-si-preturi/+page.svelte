<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	type PriceItem = {
		name: string;
		price: number;
		duration: string;
		category: 'consultatii' | 'psihoterapie' | 'tratamente' | 'logopedie';
	};

	type EvalItem = {
		name: string;
		desc: string;
		time: string;
		price: number;
		recommended?: boolean;
	};

	type EvalPath = {
		id: string;
		title: string;
		intro: string;
		items: EvalItem[];
	};

	type EntryPath = {
		id: 'adult' | 'copil' | 'cuplu';
		title: string;
		subtitle: string;
		desc: string;
		icon: 'user' | 'child' | 'heart';
		scrollTo: string;
	};

	const PRICES_BASE: PriceItem[] = [
		{ name: 'Consultație Psihiatrie Adulți — Prima Vizită', price: 350, duration: '60 min', category: 'consultatii' },
		{ name: 'Consultație Psihiatrie Adulți — Control', price: 250, duration: '30 min', category: 'consultatii' },
		{ name: 'Consultație Psihiatrie Pediatrică — Prima Vizită', price: 350, duration: '60 min', category: 'consultatii' },
		{ name: 'Consultație Psihiatrie Pediatrică — Control', price: 250, duration: '30 min', category: 'consultatii' },
		{ name: 'Ședință Psihoterapie Individuală', price: 200, duration: '50 min', category: 'psihoterapie' },
		{ name: 'Ședință Terapie de Cuplu', price: 300, duration: '90 min', category: 'psihoterapie' },
		{ name: 'Ședință Neurofeedback', price: 150, duration: '45 min', category: 'tratamente' },
		{ name: 'Ședință Hipnoză Clinică', price: 250, duration: '60 min', category: 'tratamente' },
		{ name: 'Evaluare Logopedică', price: 400, duration: '3 h', category: 'logopedie' }
	];

	const EVAL_PATHS: EvalPath[] = [
		{
			id: 'autism',
			title: 'Suspectați autism la copilul dumneavoastră',
			intro: 'Diagnosticul autismului folosește instrumente standardizate la nivel internațional (ADOS, ADI-R). Recomandăm pachetul complet pentru un diagnostic corect.',
			items: [
				{ name: 'Pachet complet de diagnostic (ADOS + ADI-R)', desc: 'Combinația standard la nivel internațional pentru diagnostic TSA', time: '7 ore', price: 1000, recommended: true },
				{ name: 'Pachet extins cu nivel de dezvoltare (+ Portage)', desc: 'Pentru copiii mici, oferă și o imagine completă a dezvoltării', time: '9 ore', price: 1300 },
				{ name: 'Pachet extins cu coeficient de inteligență (+ Raven)', desc: 'Util când e necesară orientare școlară sau Anexa 8', time: '9 ore', price: 1300 },
				{ name: 'ADOS — doar evaluarea copilului', desc: 'Pentru cazurile cu interviu deja realizat', time: '5 ore', price: 675 },
				{ name: 'ADI-R — doar interviul cu părintele', desc: 'Pentru cazurile cu evaluare ADOS deja realizată', time: '4 ore', price: 540 }
			]
		},
		{
			id: 'adhd',
			title: 'Suspectați ADHD sau probleme de atenție',
			intro: 'Folosim teste validate pentru copii, adolescenți și adulți. Pentru un diagnostic complet, deseori combinăm mai multe instrumente.',
			items: [
				{ name: 'Diagnostic ADHD adulți (DIVA-5)', desc: 'Conform criteriilor DSM-5, recomandat pentru adulți', time: '3 ore', price: 450, recommended: true },
				{ name: 'Diferențiere ADHD / personalitate (MCMI + DIVA-5)', desc: 'Când există suspiciuni clinice complexe la adulți', time: '5 ore', price: 700 },
				{ name: 'Evaluare neuropsihologică — un domeniu (NEPSY)', desc: 'Atenție, memorie, limbaj — la copii și adolescenți', time: '4 ore', price: 600 },
				{ name: 'Evaluare neuropsihologică completă (NEPSY extins)', desc: 'Toate domeniile cognitive — analiză profundă', time: '7–8 ore', price: 1100 },
				{ name: 'Test de atenție și concentrare (D2, 11–19 ani)', desc: 'Test specific pentru atenția susținută', time: '3 h 30 min', price: 450 }
			]
		},
		{
			id: 'scoala',
			title: 'Pentru școală sau Anexa 8',
			intro: 'Documente oficiale pentru comisiile de orientare școlară sau încadrare în grad de handicap. Eliberăm raport cu timbru.',
			items: [
				{ name: 'Anexa 8 — Încadrare handicap / Orientare școlară', desc: 'Pentru comisiile oficiale, cu raport timbrat', time: '2 ore', price: 350, recommended: true },
				{ name: 'Coeficient de inteligență (Raven)', desc: 'Inteligență neverbală pentru copii, adolescenți și adulți', time: '2 ore', price: 300 },
				{ name: 'Scala de Dezvoltare Portage', desc: 'Pentru copii mici — nivel global de dezvoltare', time: '4 h 30 min', price: 600 },
				{ name: 'Comportament adaptativ (ABAS-II)', desc: 'Util în orientare școlară și încadrare în grad de handicap', time: '3 ore', price: 400 },
				{ name: 'Evaluare Logopedică', desc: 'Pentru tulburări de limbaj și comunicare', time: '3 ore', price: 400 }
			]
		},
		{
			id: 'psihiatric',
			title: 'Screening psihiatric general',
			intro: 'Evaluare comprehensivă a stării psihiatrice — pentru copii, adolescenți sau adulți. Identificăm prezența unor tulburări care pot necesita atenție.',
			items: [
				{ name: 'Screening preșcolari 3–7 ani (ECI-4)', desc: 'Identifică timpuriu tulburări psihiatrice', time: '3 ore', price: 400 },
				{ name: 'Screening copii 7–12 ani (CSI-4)', desc: 'Pentru vârsta școlară, completat de părinte', time: '3 ore', price: 400 },
				{ name: 'Screening adolescenți 13–18 ani (ASI-4)', desc: 'Evaluare completă pentru această perioadă sensibilă', time: '3 ore', price: 400 },
				{ name: 'Pachet ASEBA 6–11 ani', desc: 'Tulburări de internalizare și externalizare', time: '3 h 30 min', price: 500 },
				{ name: 'Pachet ASEBA 11–18 ani', desc: 'Cu autoevaluare și raport cadru didactic', time: '5 ore', price: 700 }
			]
		},
		{
			id: 'depresie',
			title: 'Depresie sau probleme cognitive — adulți',
			intro: 'Evaluări specifice pentru adulți: depresie, deteriorare cognitivă, profil de personalitate.',
			items: [
				{ name: 'Evaluare Depresie (BDI / Beck)', desc: 'Inventarul Beck — standardul pentru depresie la adulți', time: '2 ore', price: 270, recommended: true },
				{ name: 'Profil personalitate adulți (MCMI)', desc: 'Personalitate și sindroame clinice', time: '3 h 30 min', price: 500 },
				{ name: 'Deteriorare cognitivă / demență (MMSE)', desc: 'Mini-Mental State Examination — screening cognitiv', time: '2 ore', price: 250 },
				{ name: 'Pachet depresie + personalitate (BDI + Big Five)', desc: 'Imagine completă pentru context terapeutic', time: '3 h 30 min', price: 450 }
			]
		},
		{
			id: 'personalitate',
			title: 'Profil de personalitate copii și adolescenți',
			intro: 'Pentru a înțelege mai bine personalitatea în formare a copilului sau adolescentului dumneavoastră.',
			items: [
				{ name: 'M-PACI — Preadolescenți 9–12 ani', desc: 'Personalitate emergentă și sindroame clinice', time: '4 ore', price: 540 },
				{ name: 'MACI — Adolescenți 13–18 ani', desc: 'Profil complet pentru această perioadă', time: '4 ore', price: 540 },
				{ name: 'Pachet ASI-4 + MACI + Raven', desc: 'Evaluare comprehensivă adolescenți: psihiatrie + personalitate + IQ', time: '6 h 30 min', price: 850 }
			]
		}
	];

	const ENTRY_PATHS: EntryPath[] = [
		{ id: 'adult', title: 'Pentru mine', subtitle: 'Adult, peste 18 ani', desc: 'Consultații psihiatrice, psihoterapie individuală, evaluări pentru adulți.', icon: 'user', scrollTo: 'consultatii' },
		{ id: 'copil', title: 'Pentru copilul meu', subtitle: '0–18 ani', desc: 'Psihiatrie pediatrică, evaluări de dezvoltare, autism, ADHD, școală.', icon: 'child', scrollTo: 'evaluari' },
		{ id: 'cuplu', title: 'Pentru cuplu sau familie', subtitle: 'Terapie de cuplu', desc: 'Ședințe de consiliere și terapie pentru relații.', icon: 'heart', scrollTo: 'psihoterapie' }
	];

	const INFO_UTILE = [
		{ title: 'Metode de plată', body: 'Numerar, card bancar (Visa, Mastercard) și transfer bancar. Plata se face la finalul consultației.' },
		{ title: 'Decontare', body: 'Nu avem contract cu CNAS — toate serviciile sunt private. La cerere, eliberăm documente pentru asigurări private.' },
		{ title: 'Politica de anulare', body: 'Reprogramare gratuită cu cel puțin 24 de ore înainte. Anulările tardive pot fi taxate.' },
		{ title: 'Prima vizită', body: 'Aduceți documente medicale relevante și ajungeți cu 10 minute înainte de programare.' }
	];

	let activeEntry = $state<string | null>(null);
	let openEvalPath = $state<string | null>(null);

	function selectEntry(path: EntryPath) {
		activeEntry = path.id;
		setTimeout(() => {
			const el = document.getElementById(path.scrollTo);
			if (el) {
				const top = el.getBoundingClientRect().top + window.scrollY - 90;
				window.scrollTo({ top, behavior: 'smooth' });
			}
		}, 100);
	}

	function toggleEvalPath(id: string) {
		openEvalPath = openEvalPath === id ? null : id;
	}

	const consultatii = PRICES_BASE.filter((p) => p.category === 'consultatii');
	const psihoterapie = PRICES_BASE.filter((p) => p.category === 'psihoterapie');
	const tratamente = PRICES_BASE.filter((p) => p.category === 'tratamente');
	const logopedie = PRICES_BASE.filter((p) => p.category === 'logopedie');

	function pathPriceRange(items: EvalItem[]): string {
		const prices = items.map((i) => i.price);
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		return `${min}–${max} RON`;
	}
</script>

<svelte:head>
	<title>Servicii și Prețuri - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Consultații psihiatrice, psihoterapie, evaluări psihologice, neurofeedback și logopedie la Clinica Sf. Gherasim. Prețuri transparente, abordare empatică."
	/>
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto text-center">
				<div class="flex items-center justify-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Servicii & Prețuri
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6">
					Ce te aduce <span class="text-[#c13333]">la noi?</span>
				</h1>
				<p class="text-lg text-gray-600 leading-[1.65] max-w-xl mx-auto">
					Alege o cale și te ghidăm prin serviciile potrivite. Lista completă cu prețuri
					transparente este mai jos.
				</p>
			</div>
		</div>
	</section>

	<!-- ENTRY PATHS (DARK) -->
	<section class="bg-gray-900 py-16 md:py-20 relative overflow-hidden">
		<div
			class="absolute -top-36 -right-24 w-96 h-96 rounded-full blur-[80px] opacity-10"
			style="background: #c13333;"
		></div>
		<div class="container-custom relative z-10">
			<div class="grid md:grid-cols-3 gap-5">
				{#each ENTRY_PATHS as p}
					{@const isActive = activeEntry === p.id}
					<button
						type="button"
						onclick={() => selectEntry(p)}
						class="text-left rounded p-9 transition-all border"
						style={isActive
							? 'background: #c13333; border-color: #c13333;'
							: 'background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12);'}
					>
						<div
							class="w-12 h-12 rounded-full flex items-center justify-center text-white mb-6"
							style={isActive
								? 'background: rgba(255,255,255,0.18);'
								: 'background: rgba(255,255,255,0.06);'}
						>
							<Icon name={p.icon} size="22" />
						</div>
						<div
							class="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5"
							style={isActive ? 'color: rgba(255,255,255,0.85);' : 'color: rgba(255,255,255,0.5);'}
						>
							{p.subtitle}
						</div>
						<div class="text-2xl md:text-[26px] font-extrabold text-white mb-3 leading-[1.15]">
							{p.title}
						</div>
						<div
							class="text-base leading-[1.65]"
							style={isActive
								? 'color: rgba(255,255,255,0.85);'
								: 'color: rgba(255,255,255,0.55);'}
						>
							{p.desc}
						</div>
						<div
							class="mt-5 text-xs font-bold text-white flex items-center gap-1.5 {isActive
								? 'opacity-100'
								: 'opacity-70'}"
						>
							{isActive ? 'Selectat' : 'Vezi servicii'}
							<Icon name="arrow-right" size="13" />
						</div>
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- HELP CALLOUT -->
	<section class="bg-[#f8f9fa] py-14">
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
							Nu sunteți sigur de ce aveți nevoie?
						</h2>
						<p class="text-base text-gray-700 leading-[1.7] mb-4">
							Oferim o gamă largă de servicii medicale și evaluări psihologice — înțelegem că
							poate fi greu să identificați singur ce vi se potrivește. Pentru recomandări
							personalizate, vă invităm să ne sunați. Vă vom asculta și vă vom îndruma către
							specialistul potrivit.
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

	<!-- CONSULTAȚII -->
	<section id="consultatii" class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom max-w-4xl">
			<div class="mb-10">
				<div class="flex items-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Consultații Psihiatrice
					</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
					Consultații <span class="text-[#c13333]">psihiatrice</span>
				</h2>
				<p class="text-base text-gray-600 leading-[1.65] max-w-2xl">
					Prima vizită include interviu detaliat, anamneză și plan terapeutic. Controalele
					monitorizează evoluția tratamentului.
				</p>
			</div>
			<div class="flex flex-col gap-2.5">
				{#each consultatii as item}
					<div
						class="grid grid-cols-[1fr_auto_auto] gap-6 items-center bg-white border border-gray-200 rounded p-5 md:p-6"
					>
						<div>
							<div class="text-base font-semibold text-gray-900 leading-[1.4]">{item.name}</div>
							<div class="text-sm text-gray-600 mt-1">{item.duration}</div>
						</div>
						<div class="text-2xl font-extrabold text-[#c13333] whitespace-nowrap">
							{item.price} <span class="text-sm text-gray-600 font-medium">RON</span>
						</div>
						<a
							href="/programare"
							class="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#155e75] hover:text-[#0e4458] whitespace-nowrap"
						>
							Programează
							<Icon name="arrow-right" size="13" />
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- PSIHOTERAPIE (DARK + glow) -->
	<section
		id="psihoterapie"
		class="bg-gray-900 py-20 md:py-24 text-white relative overflow-hidden"
	>
		<div
			class="absolute -top-52 -left-24 w-96 h-96 rounded-full blur-[80px] opacity-[0.12]"
			style="background: #c13333;"
		></div>
		<div class="container-custom relative z-10 max-w-4xl">
			<div class="mb-10">
				<div class="flex items-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-white/40"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
						Ședințe Terapeutice
					</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
					Psihoterapie <span class="text-[#c13333]">& consiliere</span>
				</h2>
				<p class="text-lg text-white/80 leading-[1.65] max-w-2xl">
					Spațiul sigur, fără judecată, pentru a procesa și a crește. Ședințe individuale sau de
					cuplu cu psihoterapeuți acreditați.
				</p>
			</div>
			<div class="flex flex-col gap-2.5">
				{#each psihoterapie as item}
					<div
						class="grid grid-cols-[1fr_auto_auto] gap-6 items-center bg-white/[0.04] border border-white/10 rounded p-5 md:p-6"
					>
						<div>
							<div class="text-base font-semibold text-white leading-[1.4]">{item.name}</div>
							<div class="text-sm text-white/70 mt-1">{item.duration}</div>
						</div>
						<div class="text-2xl font-extrabold text-white whitespace-nowrap">
							{item.price} <span class="text-sm text-white/70 font-medium">RON</span>
						</div>
						<a
							href="/programare"
							class="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-white hover:text-white/80 whitespace-nowrap"
						>
							Programează
							<Icon name="arrow-right" size="13" />
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- EVALUĂRI -->
	<section id="evaluari" class="bg-white py-20 md:py-24 border-y border-gray-200">
		<div class="container-custom max-w-4xl">
			<div class="text-center mb-12">
				<div class="flex items-center justify-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Evaluări Psihologice
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
					Pornind de <span class="text-[#c13333]">la nevoia ta</span>
				</h2>
				<p class="text-base text-gray-600 leading-[1.65] max-w-2xl mx-auto">
					Evaluările pot părea complicate la prima vedere. Le-am grupat după ce căutați — alegeți
					situația dumneavoastră și vedeți doar opțiunile relevante.
				</p>
			</div>
			<div class="flex flex-col gap-3.5">
				{#each EVAL_PATHS as path}
					{@const isOpen = openEvalPath === path.id}
					<div class="bg-white border border-gray-200 rounded overflow-hidden">
						<button
							type="button"
							onclick={() => toggleEvalPath(path.id)}
							class="w-full px-7 py-7 bg-transparent flex justify-between items-start gap-6 text-left cursor-pointer"
						>
							<div class="flex-1">
								<div class="text-xl md:text-2xl font-extrabold text-gray-900 leading-[1.25] mb-2">
									{path.title}
								</div>
								<div class="text-base text-gray-600 leading-[1.6] max-w-2xl">{path.intro}</div>
							</div>
							<div class="flex-shrink-0 flex items-center gap-2.5 pt-1.5">
								<span class="text-sm text-gray-600 hidden sm:inline">
									{path.items.length} opțiuni · {pathPriceRange(path.items)}
								</span>
								<span
									class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-light transition-all"
									style={isOpen
										? 'background: #c13333; color: white;'
										: 'background: #f5f1ea; color: #1f2937;'}
								>
									<span
										class="inline-block transition-transform {isOpen ? 'rotate-45' : ''}"
									>
										+
									</span>
								</span>
							</div>
						</button>
						{#if isOpen}
							<div class="px-6 pb-7 pt-2 border-t border-gray-200 bg-[#f8f9fa]">
								<div class="flex flex-col gap-2.5 mt-4">
									{#each path.items as item}
										<div
											class="bg-white rounded overflow-hidden"
											style={item.recommended
												? 'border: 1px solid #c1333355; box-shadow: 0 4px 12px #c1333315;'
												: 'border: 1px solid #e5e7eb;'}
										>
											{#if item.recommended}
												<div
													class="text-white text-[10px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 flex items-center gap-1.5"
													style="background: #c13333;"
												>
													<span class="inline-block w-1.5 h-1.5 bg-white rounded-full"></span>
													Recomandat
												</div>
											{/if}
											<div
												class="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 sm:gap-6 items-center p-5"
											>
												<div>
													<div class="text-base font-bold text-gray-900 leading-[1.4] mb-1">
														{item.name}
													</div>
													<div class="text-sm text-gray-600 leading-[1.55]">{item.desc}</div>
												</div>
												<div class="text-right whitespace-nowrap">
													<div class="text-[22px] font-extrabold text-[#c13333] leading-none">
														{item.price}
														<span class="text-xs text-gray-500 font-medium">RON</span>
													</div>
													<div class="text-[11px] text-gray-500 mt-1">{item.time}</div>
												</div>
												<a
													href="/programare"
													class="hidden sm:inline-flex items-center gap-1 text-[13px] font-bold text-[#155e75] hover:text-[#0e4458] whitespace-nowrap"
												>
													Programează
													<Icon name="arrow-right" size="13" />
												</a>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- TRATAMENTE + LOGOPEDIE (split) -->
	<section class="bg-white py-20 md:py-24">
		<div class="container-custom max-w-4xl">
			<div class="grid md:grid-cols-2 gap-12">
				<div>
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Tehnici Specializate
						</span>
					</div>
					<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
						Tratamente <span class="text-[#c13333]">moderne</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.7] mb-6">
						Neurofeedback și hipnoză clinică — abordări complementare validate științific.
					</p>
					<div class="flex flex-col gap-2.5">
						{#each tratamente as item}
							<div
								class="grid grid-cols-[1fr_auto] gap-3 items-center bg-white border border-gray-200 rounded p-4"
							>
								<div>
									<div class="text-sm font-semibold text-gray-900 leading-[1.4]">{item.name}</div>
									<div class="text-sm text-gray-600 mt-1">{item.duration}</div>
								</div>
								<div class="text-xl font-extrabold text-[#c13333] whitespace-nowrap">
									{item.price} <span class="text-xs text-gray-500 font-medium">RON</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div>
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Tulburări de Limbaj
						</span>
					</div>
					<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
						Evaluare <span class="text-[#c13333]">logopedică</span>
					</h2>
					<p class="text-base text-gray-600 leading-[1.7] mb-6">
						Pentru copii cu tulburări de limbaj și comunicare. Evaluare comprehensivă cu plan de
						terapie.
					</p>
					<div class="flex flex-col gap-2.5">
						{#each logopedie as item}
							<div
								class="grid grid-cols-[1fr_auto] gap-3 items-center bg-white border border-gray-200 rounded p-4"
							>
								<div>
									<div class="text-sm font-semibold text-gray-900 leading-[1.4]">{item.name}</div>
									<div class="text-sm text-gray-600 mt-1">{item.duration}</div>
								</div>
								<div class="text-xl font-extrabold text-[#c13333] whitespace-nowrap">
									{item.price} <span class="text-xs text-gray-500 font-medium">RON</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- INFO UTILE -->
	<section class="bg-[#f8f9fa] py-20 border-t border-gray-200">
		<div class="container-custom max-w-4xl">
			<div class="mb-10">
				<div class="flex items-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Înainte de Programare
					</span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
					Informații <span class="text-[#c13333]">utile</span>
				</h2>
			</div>
			<div class="grid md:grid-cols-2 gap-8">
				{#each INFO_UTILE as item}
					<div class="pl-6 border-l-2" style="border-color: #155e75;">
						<div class="text-xl font-extrabold text-gray-900 mb-2.5">{item.title}</div>
						<div class="text-base text-gray-600 leading-[1.7]">{item.body}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="bg-[#c13333] py-20 text-white">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<h2 class="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.15]">
					Suntem aici să vă ascultăm.
				</h2>
				<p class="text-lg leading-[1.65] opacity-90 mb-8">
					Sunați-ne și vă vom îndruma către serviciul potrivit pentru dumneavoastră sau familia
					dumneavoastră.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href="tel:+40376501501"
						class="inline-flex items-center gap-2 bg-white text-[#c13333] hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						<Icon name="phone" size="16" />
						+40 376 501 501
					</a>
					<a
						href="/programare"
						class="inline-flex items-center gap-2 border-2 border-white/50 text-white hover:bg-white/10 font-bold text-base px-8 py-3.5 rounded transition-colors"
					>
						Programează online
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
