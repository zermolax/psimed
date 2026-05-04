<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	const promotions = [
		{
			locale: 'RO',
			href: '/promotii/suport-parental-speranta',
			title: 'Suport Parental & Speranță',
			subtitle: 'Diagnostic și intervenție timpurie TSA — în limba română'
		},
		{
			locale: 'EN',
			href: '/promotii/parental-support-hope',
			title: 'Parental Support & Hope',
			subtitle: 'Early autism diagnosis and intervention — in English'
		},
		{
			locale: 'IT',
			href: '/promotii/supporto-genitori-speranza',
			title: 'Supporto Genitori & Speranza',
			subtitle: 'Diagnosi e intervento precoce autismo — in italiano'
		}
	];
</script>

<svelte:head>
	<title>Promoții și campanii — Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Campanii informative și pagini dedicate părinților și pacienților Clinicii Sf. Gherasim."
	/>
</svelte:head>

<section class="bg-gradient-to-b from-emerald-50/40 via-white to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto">
			<div class="mb-10">
				<h1 class="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
					Promoții și campanii
				</h1>
				<p class="text-lg text-gray-700">
					Pagini dedicate părinților, pacienților și familiilor — disponibile în mai multe limbi.
				</p>
			</div>

			<div class="grid gap-4">
				{#each promotions as promo}
					<a
						href={promo.href}
						class="group flex items-start gap-5 p-6 bg-white border border-emerald-100 rounded-2xl hover:border-emerald-300 hover:shadow-md transition-all"
					>
						<div
							class="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors"
						>
							<Icon name="heart" size="24" />
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-1">
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide"
								>
									{promo.locale}
								</span>
								<h2 class="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
									{promo.title}
								</h2>
							</div>
							<p class="text-gray-600 text-sm">{promo.subtitle}</p>
						</div>
						<div class="flex-shrink-0 self-center text-gray-400 group-hover:text-emerald-700 transition-colors">
							→
						</div>
					</a>
				{/each}
			</div>

			<div class="mt-10 text-center">
				<Button href="/" variant="secondary" size="md">← Înapoi la pagina principală</Button>
			</div>
		</div>
	</div>
</section>
