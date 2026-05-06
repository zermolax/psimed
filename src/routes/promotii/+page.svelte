<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import type { PromotionCard } from '$lib/queries';

	let { data } = $props();
	const cmsPromotions = data.promotions;

	// Fallback hardcodat — funcționează până când campaniile sunt importate în Sanity.
	// După import, datele din Sanity au prioritate.
	const fallbackPromotions: PromotionCard[] = [
		{
			slug: 'suport-parental-speranta',
			title: 'Suport Parental & Speranță',
			locale: 'ro',
			campaignKey: 'suport-parental-speranta',
			subtitle: 'Diagnostic și intervenție timpurie TSA — în limba română',
			excerpt:
				'Drumul către un diagnostic poate fi lung și emoționant. Vă oferim sprijin la fiecare pas: evaluare ADOS/ADI-R, plan personalizat și o echipă care ascultă.',
			publishedAt: '2026-04-01T00:00:00Z'
		},
		{
			slug: 'parental-support-hope',
			title: 'Parental Support & Hope',
			locale: 'en',
			campaignKey: 'suport-parental-speranta',
			subtitle: 'Early autism diagnosis and intervention — in English',
			excerpt:
				'The path to a diagnosis can be long and emotional. We support you at every step: ADOS/ADI-R assessment, personalized plan, and a team that listens.',
			publishedAt: '2026-04-01T00:00:00Z'
		},
		{
			slug: 'supporto-genitori-speranza',
			title: 'Supporto Genitori & Speranza',
			locale: 'it',
			campaignKey: 'suport-parental-speranta',
			subtitle: 'Diagnosi e intervento precoce autismo — in italiano',
			excerpt:
				'Il percorso verso una diagnosi può essere lungo ed emotivo. Vi sosteniamo in ogni fase: valutazione ADOS/ADI-R, piano personalizzato, una équipe che ascolta.',
			publishedAt: '2026-04-01T00:00:00Z'
		}
	];

	const promotions = cmsPromotions.length > 0 ? cmsPromotions : fallbackPromotions;

	const localeGroups: Array<{
		key: 'ro' | 'en' | 'it';
		eyebrow: string;
		title: string;
		flag: string;
		accent: string;
		accentBg: string;
		readMoreLabel: string;
	}> = [
		{
			key: 'ro',
			eyebrow: 'În română',
			title: 'Pentru părinți români',
			flag: 'RO',
			accent: '#c13333',
			accentBg: '#fef2f2',
			readMoreLabel: 'Citește mai mult'
		},
		{
			key: 'en',
			eyebrow: 'In English',
			title: 'For English-speaking parents',
			flag: 'EN',
			accent: '#155e75',
			accentBg: '#cffafe',
			readMoreLabel: 'Read more'
		},
		{
			key: 'it',
			eyebrow: 'In italiano',
			title: 'Per genitori italiani',
			flag: 'IT',
			accent: '#b45309',
			accentBg: '#fef3c7',
			readMoreLabel: 'Leggi di più'
		}
	];

	function formatDate(iso: string, locale: 'ro' | 'en' | 'it'): string {
		const localeTag = locale === 'ro' ? 'ro-RO' : locale === 'en' ? 'en-GB' : 'it-IT';
		return new Date(iso).toLocaleDateString(localeTag, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Campanii și inițiative — Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Campanii educaționale și inițiative ale Clinicii Sf. Gherasim — Bacău, traduse în română, engleză și italiană pentru a ajunge la cât mai multe familii."
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
						Campanii și Inițiative
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h1
					class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6"
				>
					Pentru fiecare <span class="text-[#c13333]">familie</span>
				</h1>
				<p class="text-lg text-gray-700 leading-[1.65] max-w-2xl mx-auto">
					Materiale educaționale și inițiative — traduse în trei limbi pentru a ajunge la cât mai
					multe familii. Selectează limba care îți este accesibilă.
				</p>
			</div>
		</div>
	</section>

	<!-- LANGUAGE-GROUPED SECTIONS -->
	{#each localeGroups as group}
		{@const items = promotions.filter((p) => p.locale === group.key)}
		{#if items.length > 0}
			<section
				class="py-16 md:py-20 {group.key === 'en'
					? 'bg-white border-y border-gray-200'
					: 'bg-[#f8f9fa]'}"
			>
				<div class="container-custom">
					<div class="max-w-5xl mx-auto">
						<div class="flex items-center gap-3 mb-8">
							<span
								class="inline-flex items-center justify-center text-white font-extrabold text-lg w-12 h-12 rounded"
								style="background: {group.accent};"
							>
								{group.flag}
							</span>
							<div>
								<div
									class="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-1"
								>
									{group.eyebrow}
								</div>
								<h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
									{group.title}
								</h2>
							</div>
						</div>

						<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
							{#each items as p}
								<a
									href="/promotii/{p.slug}"
									class="group flex flex-col bg-white rounded border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all"
								>
									{#if p.coverUrl}
										<div class="aspect-video overflow-hidden bg-gray-100">
											<img
												src={p.coverUrl}
												alt={p.title}
												class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
									{:else}
										<div
											class="aspect-video flex items-center justify-center"
											style="background: {group.accentBg}; color: {group.accent};"
										>
											<Icon name="heart" size="48" />
										</div>
									{/if}
									<div class="p-6 flex flex-col flex-1">
										<div class="flex items-center gap-2 mb-3">
											<span
												class="inline-block text-xs font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded"
												style="background: {group.accent};"
											>
												{group.flag}
											</span>
											<time class="text-sm text-gray-500">
												{formatDate(p.publishedAt, p.locale)}
											</time>
										</div>
										<h3 class="text-xl font-extrabold text-gray-900 mb-3 leading-tight">
											{p.title}
										</h3>
										{#if p.excerpt}
											<p class="text-base text-gray-600 leading-[1.65] mb-4 flex-1">
												{p.excerpt}
											</p>
										{/if}
										<span
											class="inline-flex items-center gap-1.5 font-bold text-sm mt-auto"
											style="color: {group.accent};"
										>
											{group.readMoreLabel}
											<Icon name="arrow-right" size="14" />
										</span>
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>
			</section>
		{/if}
	{/each}

	{#if promotions.length === 0}
		<section class="py-16 bg-white">
			<div class="container-custom text-center">
				<p class="text-lg text-gray-600">
					Nu sunt campanii active. Reveniți curând — pregătim materiale noi.
				</p>
			</div>
		</section>
	{/if}

	<!-- HELP CALLOUT -->
	<section class="bg-[#f8f9fa] py-14 border-t border-gray-200">
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
							Aveți întrebări despre vreuna dintre campanii?
						</h2>
						<p class="text-base text-gray-700 leading-[1.7] mb-4">
							Sunați-ne — vă vom asculta și vă vom îndruma către specialistul potrivit pentru
							situația dumneavoastră, indiferent de limba pe care o vorbiți.
						</p>
						<a
							href="tel:+40376501501"
							class="inline-flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded transition-opacity hover:opacity-90"
							style="background: #155e75;"
						>
							<Icon name="phone" size="15" />
							+40 376 501 501
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
