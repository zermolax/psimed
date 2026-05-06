<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';

	let { data } = $props();
	const promo = data.promo!;

	const localeBadge: Record<'ro' | 'en' | 'it', { label: string; flag: string }> = {
		ro: { label: 'Română', flag: 'RO' },
		en: { label: 'English', flag: 'EN' },
		it: { label: 'Italiano', flag: 'IT' }
	};

	const seoTitle = promo.seoTitle ?? promo.title;
	const seoDescription = promo.seoDescription ?? promo.excerpt ?? '';
	const ctaHref = promo.ctaHref ?? '/programare';

	function safeIcon(name?: string): 'brain' | 'heart' | 'child' | 'user' | 'check' | 'calendar' {
		if (
			name === 'heart' ||
			name === 'child' ||
			name === 'user' ||
			name === 'check' ||
			name === 'calendar' ||
			name === 'brain'
		) {
			return name;
		}
		return 'check';
	}
</script>

<svelte:head>
	<title>{seoTitle} - Clinica Sf. Gherasim</title>
	{#if seoDescription}
		<meta name="description" content={seoDescription} />
		<meta property="og:description" content={seoDescription} />
	{/if}
	<meta property="og:title" content={seoTitle} />
	<meta property="og:type" content="website" />
	{#if promo.coverUrl}
		<meta property="og:image" content={promo.coverUrl} />
	{/if}
	{#if promo.seoKeywords && promo.seoKeywords.length > 0}
		<meta name="keywords" content={promo.seoKeywords.join(', ')} />
	{/if}
	{#if promo.altLanguages}
		{#each promo.altLanguages as alt}
			<link rel="alternate" hreflang={alt.locale} href={alt.url} />
		{/each}
	{/if}
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-16 md:py-20">
		<div class="container-custom">
			<div class="max-w-3xl mx-auto">
				<!-- Language switcher -->
				<div class="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-gray-200">
					<span class="text-sm text-gray-500 mr-2">Limbă:</span>
					<span
						class="inline-flex items-center px-3 py-1.5 rounded-full text-white font-bold uppercase tracking-wide text-xs"
						style="background: #c13333;"
					>
						{localeBadge[promo.locale].flag} · {localeBadge[promo.locale].label}
					</span>
					{#if promo.altLanguages}
						{#each promo.altLanguages as alt}
							<a
								href={alt.url}
								hreflang={alt.locale}
								class="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 uppercase tracking-wide text-xs font-medium transition-colors"
							>
								{alt.label}
							</a>
						{/each}
					{/if}
				</div>

				<!-- Eyebrow -->
				<div class="flex items-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						{localeBadge[promo.locale].label}
					</span>
				</div>

				<h1
					class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-6"
				>
					{promo.title}
				</h1>

				{#if promo.subtitle}
					<p class="text-lg text-gray-700 leading-[1.65]">{promo.subtitle}</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- COVER (optional) -->
	{#if promo.coverUrl}
		<section class="bg-[#f8f9fa]">
			<div class="container-custom">
				<div class="max-w-4xl mx-auto">
					<div class="aspect-[21/9] overflow-hidden rounded">
						<img src={promo.coverUrl} alt={promo.title} class="w-full h-full object-cover" />
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- INTRO -->
	{#if promo.intro && promo.intro.length > 0}
		<section class="bg-white py-16 md:py-20 border-y border-gray-200">
			<div class="container-custom max-w-3xl">
				<div class="text-lg text-gray-700 leading-[1.7] space-y-4">
					<PortableBody value={promo.intro} />
				</div>
			</div>
		</section>
	{/if}

	<!-- BULLETS -->
	{#if promo.bullets && promo.bullets.length > 0}
		<section class="bg-[#f8f9fa] py-16 md:py-20">
			<div class="container-custom max-w-3xl">
				<div class="rounded p-6 md:p-8 bg-white border border-gray-200">
					<ul class="space-y-5">
						{#each promo.bullets as bullet, i}
							<li
								class="flex items-start gap-4 {i < promo.bullets.length - 1
									? 'pb-5 border-b border-gray-100'
									: ''}"
							>
								<div
									class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
									style="background: #cffafe; color: #155e75;"
								>
									<Icon name={safeIcon(bullet.iconName)} size="20" />
								</div>
								<div class="flex-1 pt-1">
									<strong class="font-bold text-gray-900">{bullet.label}</strong>
									{#if bullet.description}
										<span class="text-base text-gray-700 leading-[1.65]">{bullet.description}</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	{/if}

	<!-- CLOSING -->
	{#if promo.closing && promo.closing.length > 0}
		<section class="bg-white py-16 md:py-20 border-t border-gray-200">
			<div class="container-custom max-w-3xl">
				<div class="text-lg text-gray-700 leading-[1.7] space-y-4">
					<PortableBody value={promo.closing} />
				</div>
			</div>
		</section>
	{/if}

	<!-- HASHTAGS -->
	{#if promo.hashtags && promo.hashtags.length > 0}
		<section class="bg-white py-8">
			<div class="container-custom max-w-3xl">
				<div class="flex flex-wrap gap-2">
					{#each promo.hashtags as tag}
						<span
							class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
							style="background: #cffafe; color: #155e75;"
						>
							#{tag}
						</span>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- CTA -->
	<section class="bg-[#c13333] py-16 md:py-20 text-white">
		<div class="container-custom">
			<div class="max-w-2xl mx-auto text-center">
				<a
					href={ctaHref}
					class="inline-flex items-center gap-2 bg-white text-[#c13333] hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded shadow-lg transition-colors"
				>
					<Icon name="heart" size="20" />
					{promo.ctaText ?? 'Programează o evaluare'}
				</a>
				{#if promo.ctaSubtext}
					<p class="text-base text-white/90 mt-5">{promo.ctaSubtext}</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- DISCLAIMER -->
	{#if promo.disclaimer && promo.disclaimer.length > 0}
		<section class="bg-[#f8f9fa] py-12 border-t border-gray-200">
			<div class="container-custom max-w-3xl">
				<div class="bg-white p-6 rounded border border-gray-200">
					<div class="flex items-start gap-3">
						<span class="text-base font-bold text-gray-800">⚖️ Conformitate etică medicală —</span>
						<div class="text-sm text-gray-600 leading-[1.65] flex-1">
							<PortableBody value={promo.disclaimer} />
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- BACK -->
	<section class="bg-[#f8f9fa] py-12 text-center">
		<a
			href="/promotii"
			class="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-base px-6 py-3 rounded transition-colors"
		>
			← Toate campaniile
		</a>
	</section>
</div>
