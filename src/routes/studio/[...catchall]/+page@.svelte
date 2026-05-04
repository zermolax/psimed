<script lang="ts">
	import { SanityStudio } from '@sanity/sveltekit';
	import config from '$lib/sanity/sanity.config';
</script>

<svelte:head>
	<title>Clinica Sf. Gherasim — CMS</title>
</svelte:head>

<div class="studio-root">
	<SanityStudio {config} />
</div>

<style>
	.studio-root {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		background: #fff;
		z-index: 9999;
	}
	:global(body) {
		margin: 0;
		overflow: hidden;
	}
</style>
