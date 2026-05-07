<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	export type PromotionBullet = {
		iconName: string;
		label: string;
		description: string;
	};

	export type AltLanguage = {
		locale: 'ro' | 'en' | 'it';
		url: string;
		label: string;
	};

	export type PromotionData = {
		locale: 'ro' | 'en' | 'it';
		altLanguages: AltLanguage[];
		title: string;
		intro: string;
		bullets: PromotionBullet[];
		closing?: string;
		ctaText: string;
		ctaSubtext?: string;
		ctaHref?: string;
		hashtags?: string[];
		disclaimer?: string;
		seoTitle: string;
		seoDescription: string;
		seoKeywords?: string[];
	};

	let { data }: { data: PromotionData } = $props();

	const ctaHref = data.ctaHref ?? '/programare';

	const localeBadge: Record<'ro' | 'en' | 'it', { label: string; flag: string }> = {
		ro: { label: 'Română', flag: 'RO' },
		en: { label: 'English', flag: 'EN' },
		it: { label: 'Italiano', flag: 'IT' }
	};

	function safeIcon(
		name: string
	): 'brain' | 'heart' | 'check' | 'user' | 'calendar' | 'phone' | 'email' {
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
</script>

<svelte:head>
	<title>{data.seoTitle}</title>
	<meta name="description" content={data.seoDescription} />
	<meta property="og:title" content={data.seoTitle} />
	<meta property="og:description" content={data.seoDescription} />
	<meta property="og:type" content="website" />
	{#if data.seoKeywords && data.seoKeywords.length > 0}
		<meta name="keywords" content={data.seoKeywords.join(', ')} />
	{/if}
	{#each data.altLanguages as alt}
		<link rel="alternate" hreflang={alt.locale} href={alt.url} />
	{/each}
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO + LANG SWITCHER -->
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
						{localeBadge[data.locale].flag} · {localeBadge[data.locale].label}
					</span>
					{#each data.altLanguages as alt}
						<a
							href={alt.url}
							hreflang={alt.locale}
							class="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 uppercase tracking-wide text-xs font-medium transition-colors"
						>
							{alt.label}
						</a>
					{/each}
				</div>

				<!-- Eyebrow -->
				<div class="flex items-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						{localeBadge[data.locale].label}
					</span>
				</div>

				<h1
					class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-6"
				>
					{data.title}
				</h1>
			</div>
		</div>
	</section>

	<!-- INTRO -->
	<section class="bg-white py-16 md:py-20 border-y border-gray-200">
		<div class="container-custom max-w-3xl">
			<p class="text-lg text-gray-700 leading-[1.7]">
				{@html data.intro}
			</p>
		</div>
	</section>

	<!-- BULLETS -->
	<section class="bg-[#f8f9fa] py-16 md:py-20">
		<div class="container-custom max-w-3xl">
			<div class="rounded p-6 md:p-8 bg-white border border-gray-200">
				<ul class="space-y-5">
					{#each data.bullets as bullet, i}
						<li
							class="flex items-start gap-4 {i < data.bullets.length - 1
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
								<span class="text-base text-gray-700 leading-[1.65]">
									{@html bullet.description}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- CLOSING -->
	{#if data.closing}
		<section class="bg-white py-16 md:py-20 border-t border-gray-200">
			<div class="container-custom max-w-3xl">
				<p class="text-lg text-gray-700 leading-[1.7]">
					{@html data.closing}
				</p>
			</div>
		</section>
	{/if}

	<!-- HASHTAGS -->
	{#if data.hashtags && data.hashtags.length > 0}
		<section class="bg-white py-8">
			<div class="container-custom max-w-3xl">
				<div class="flex flex-wrap gap-2">
					{#each data.hashtags as tag}
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
					{data.ctaText}
				</a>
				{#if data.ctaSubtext}
					<p class="text-base text-white/90 mt-5">{data.ctaSubtext}</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- DISCLAIMER -->
	{#if data.disclaimer}
		<section class="bg-[#f8f9fa] py-12 border-t border-gray-200">
			<div class="container-custom max-w-3xl">
				<div class="bg-white p-6 rounded border border-gray-200">
					<p class="text-sm text-gray-600 leading-[1.65]">
						<span class="font-bold text-gray-800">⚖️ Conformitate etică medicală</span> —
						{@html data.disclaimer}
					</p>
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
