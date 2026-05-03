<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';

	let { children, data } = $props();

	onMount(async () => {
		const { enableVisualEditing } = await import('@sanity/visual-editing');
		return enableVisualEditing();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex-grow">
		{@render children()}
	</main>

	<Footer siteSettings={data?.siteSettings ?? null} />
</div>
