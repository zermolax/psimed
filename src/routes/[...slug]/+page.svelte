<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';

	let { data } = $props();
	const page = data.page;

	const seoTitle = page?.seoTitle ?? page?.title ?? '';
	const seoDescription = page?.seoDescription ?? '';
	const heroTitle = page?.heroTitle ?? page?.title ?? '';
</script>

<svelte:head>
	<title>{seoTitle} - Clinica Sf. Gherasim</title>
	{#if seoDescription}
		<meta name="description" content={seoDescription} />
	{/if}
</svelte:head>

{#if page}
	<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
		<div class="container-custom">
			<div class="max-w-3xl">
				<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{heroTitle}</h1>
				{#if page.heroLead}
					<p class="text-xl text-gray-700 leading-relaxed">{page.heroLead}</p>
				{/if}
			</div>
		</div>
	</section>

	{#if page.body && page.body.length > 0}
		<section class="py-16 bg-white">
			<div class="container-custom">
				<div class="max-w-3xl mx-auto">
					<PortableBody value={page.body} />
				</div>
			</div>
		</section>
	{/if}

	<section class="py-12 bg-gray-50">
		<div class="container-custom text-center">
			<Button href="/" variant="secondary">Înapoi la pagina principală</Button>
		</div>
	</section>
{/if}
