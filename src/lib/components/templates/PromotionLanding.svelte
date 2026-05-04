<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
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
	const localeLabels: Record<'ro' | 'en' | 'it', string> = {
		ro: 'Română',
		en: 'English',
		it: 'Italiano'
	};
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
	<!-- Cross-language alternates for SEO -->
	{#each data.altLanguages as alt}
		<link rel="alternate" hreflang={alt.locale} href={alt.url} />
	{/each}
	<html lang={data.locale} />
</svelte:head>

<section class="bg-gradient-to-b from-emerald-50/40 via-white to-white py-12 md:py-16">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto">
			<!-- Language switcher -->
			<div class="flex flex-wrap items-center gap-2 mb-8 text-sm border-b border-gray-200 pb-4">
				<span class="text-gray-500 mr-2">Limbă:</span>
				<span
					class="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-700 text-white font-semibold uppercase tracking-wide text-xs"
				>
					{localeLabels[data.locale]}
				</span>
				{#each data.altLanguages as alt}
					<a
						href={alt.url}
						class="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors uppercase tracking-wide text-xs font-medium"
						hreflang={alt.locale}
					>
						{alt.label}
					</a>
				{/each}
			</div>

			<!-- Hero quote -->
			<div class="border-l-4 border-emerald-700 pl-6 mb-8">
				<h1
					class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
				>
					{data.title}
				</h1>
			</div>

			<!-- Intro paragraph (HTML allowed for inline bold) -->
			<p class="text-gray-700 text-lg leading-relaxed mb-8">
				{@html data.intro}
			</p>

			<!-- Bullets card -->
			<div class="bg-emerald-50/70 rounded-2xl p-6 md:p-8 mb-8 border border-emerald-100">
				<ul class="space-y-4">
					{#each data.bullets as bullet, i}
						<li
							class="flex items-start gap-4 {i < data.bullets.length - 1
								? 'pb-4 border-b border-emerald-100'
								: ''}"
						>
							<div
								class="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700"
							>
								<Icon name={bullet.iconName} size="20" />
							</div>
							<div class="text-gray-700 leading-relaxed pt-1.5">
								<strong class="font-semibold text-gray-900">{bullet.label}</strong>
								<span>{@html bullet.description}</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Closing paragraph -->
			{#if data.closing}
				<p class="text-gray-700 text-lg leading-relaxed mb-8">
					{@html data.closing}
				</p>
			{/if}

			<!-- CTA -->
			<div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
				<a
					href={ctaHref}
					class="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
				>
					<Icon name="heart" size="20" class="text-emerald-200" />
					{data.ctaText}
				</a>
				{#if data.ctaSubtext}
					<p class="text-sm text-gray-600">{data.ctaSubtext}</p>
				{/if}
			</div>

			<!-- Hashtags -->
			{#if data.hashtags && data.hashtags.length > 0}
				<div class="flex flex-wrap gap-2 mb-12">
					{#each data.hashtags as tag}
						<span
							class="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100/60 text-emerald-800 text-sm font-medium"
						>
							#{tag}
						</span>
					{/each}
				</div>
			{/if}

			<!-- Disclaimer -->
			{#if data.disclaimer}
				<div class="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
					<p class="text-sm text-gray-600 leading-relaxed">
						<span class="font-semibold text-gray-800">⚖️ Conformitate etică medicală</span> —
						{@html data.disclaimer}
					</p>
				</div>
			{/if}

			<!-- Back to home -->
			<div class="mt-10 text-center">
				<Button href="/" variant="secondary" size="md">
					← {data.locale === 'ro' ? 'Înapoi la pagina principală' : data.locale === 'en' ? 'Back to home' : 'Torna alla pagina principale'}
				</Button>
			</div>
		</div>
	</div>
</section>
