<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<svelte:head>
	<title>Pagina nu a fost găsită - Clinica Sf. Gherasim</title>
</svelte:head>

<section class="py-24 bg-gray-50 min-h-[60vh] flex items-center">
	<div class="container-custom text-center">
		<div class="max-w-lg mx-auto">
			<p class="text-8xl font-black text-primary mb-4">{$page.status}</p>
			<h1 class="text-3xl font-bold text-gray-900 mb-4">
				{#if $page.status === 404}
					Pagina nu a fost găsită
				{:else}
					A apărut o eroare
				{/if}
			</h1>
			<p class="text-gray-600 mb-8">
				{#if $page.status === 404}
					Pagina pe care o căutați nu există sau a fost mutată.
				{:else}
					{$page.error?.message ?? 'A apărut o eroare neașteptată. Vă rugăm încercați din nou.'}
				{/if}
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/" variant="primary">Acasă</Button>
				<Button href="/programare" variant="secondary">Fă o programare</Button>
			</div>
		</div>
	</div>
</section>
