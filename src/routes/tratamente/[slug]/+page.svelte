<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import treatmentsData from '../../../content/data/treatments.json';

	let slug = $derived($page.params.slug);
	let treatment = $derived(treatmentsData.find((t) => t.slug === slug));
	let relatedTreatments = $derived(treatmentsData.filter((t) => t.slug !== slug).slice(0, 3));
</script>

{#if treatment}
	<svelte:head>
		<title>{treatment.title} - Clinica Sf. Gherasim</title>
		<meta name="description" content={treatment.description} />
	</svelte:head>

	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
		<div class="container-custom">
			<div class="max-w-4xl mx-auto text-center">
				<div class="inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
					<Icon name={treatment.icon} size="64" class="text-primary" />
				</div>
				<h1 class="text-4xl md:text-5xl font-bold mb-6">{treatment.title}</h1>
				<p class="text-xl text-gray-600 leading-relaxed">{treatment.description}</p>
			</div>
		</div>
	</section>

	<!-- Treatment Details -->
	<section class="section-spacing bg-white">
		<div class="container-custom max-w-4xl">
			<!-- Quick Info Cards -->
			<div class="grid md:grid-cols-3 gap-6 mb-12">
				<div class="bg-gray-50 rounded-xl p-6">
					<Icon name="calendar" size="32" class="text-primary mb-3" />
					<h3 class="font-bold mb-2">Durată tratament</h3>
					<p class="text-gray-600">{treatment.duration}</p>
				</div>
				<div class="bg-gray-50 rounded-xl p-6">
					<Icon name="check" size="32" class="text-primary mb-3" />
					<h3 class="font-bold mb-2">Frecvență ședințe</h3>
					<p class="text-gray-600">{treatment.frequency}</p>
				</div>
				<div class="bg-gray-50 rounded-xl p-6">
					<Icon name="heart" size="32" class="text-primary mb-3" />
					<h3 class="font-bold mb-2">Eficiență</h3>
					<p class="text-gray-600">{treatment.effectiveness}</p>
				</div>
			</div>

			<!-- What We Treat -->
			<div class="mb-12">
				<h2 class="text-3xl font-bold mb-6">Pentru ce afecțiuni?</h2>
				<p class="text-lg text-gray-600 mb-6">
					Acest tratament este eficient pentru următoarele condiții:
				</p>
				<div class="grid md:grid-cols-2 gap-4">
					{#each treatment.conditions as condition}
						<div class="flex items-start space-x-3">
							<Icon name="check" size="20" class="text-primary flex-shrink-0 mt-1" />
							<span class="text-gray-700">{condition}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Approach -->
			<div class="mb-12 bg-primary-light rounded-xl p-8">
				<h2 class="text-3xl font-bold mb-6">Cum funcționează?</h2>
				<p class="text-lg text-gray-700 leading-relaxed">{treatment.approach}</p>
			</div>

			<!-- Scientific Evidence (placeholder) -->
			<div class="mb-12">
				<h2 class="text-3xl font-bold mb-6">Susținut științific</h2>
				<p class="text-lg text-gray-600 leading-relaxed">
					Tratamentul {treatment.title.toLowerCase()} este validat de numeroase studii clinice și este
					recomandat de ghiduri internaționale de practică clinică. Eficiența sa a fost demonstrată în
					multiple cercetări controlate randomizate.
				</p>
			</div>

			<!-- What to Expect -->
			<div class="mb-12 border-l-4 border-primary pl-6">
				<h2 class="text-2xl font-bold mb-4">Ce să te aștepți?</h2>
				<ul class="space-y-3 text-gray-700">
					<li class="flex items-start space-x-2">
						<span class="text-primary font-bold">•</span>
						<span>Evaluare inițială detaliată pentru a stabili eligibilitatea</span>
					</li>
					<li class="flex items-start space-x-2">
						<span class="text-primary font-bold">•</span>
						<span>Plan de tratament personalizat adaptat nevoilor tale</span>
					</li>
					<li class="flex items-start space-x-2">
						<span class="text-primary font-bold">•</span>
						<span>Monitorizare continuă a progresului</span>
					</li>
					<li class="flex items-start space-x-2">
						<span class="text-primary font-bold">•</span>
						<span>Ajustări ale tratamentului bazate pe răspunsul tău</span>
					</li>
					<li class="flex items-start space-x-2">
						<span class="text-primary font-bold">•</span>
						<span>Suport și consiliere pe tot parcursul tratamentului</span>
					</li>
				</ul>
			</div>

			<!-- CTA -->
			<div class="text-center pt-8 border-t border-gray-200">
				<h3 class="text-2xl font-bold mb-4">Gata să începi tratamentul?</h3>
				<p class="text-gray-600 mb-6 max-w-2xl mx-auto">
					Programează o consultație inițială pentru a discuta despre eligibilitatea ta și pentru a
					primi mai multe informații despre acest tratament.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button href="/programare?treatment={treatment.slug}" variant="primary" size="lg">
						Programează Consultație
					</Button>
					<Button href="/contact" variant="outline" size="lg"> Întreabă un Specialist </Button>
				</div>
			</div>
		</div>
	</section>

	<!-- Related Treatments -->
	{#if relatedTreatments.length > 0}
		<section class="section-spacing bg-gray-50">
			<div class="container-custom">
				<h2 class="text-3xl font-bold text-center mb-12">Alte tratamente</h2>
				<div class="grid md:grid-cols-3 gap-8">
					{#each relatedTreatments as relatedTreatment}
						<a
							href="/tratamente/{relatedTreatment.slug}"
							class="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200 block"
						>
							<div class="text-primary mb-4">
								<Icon name={relatedTreatment.icon} size="48" />
							</div>
							<h3 class="text-xl font-bold mb-2">{relatedTreatment.title}</h3>
							<p class="text-gray-600 mb-4">{relatedTreatment.description}</p>
							<span class="text-primary font-medium inline-flex items-center space-x-1">
								<span>Vezi detalii</span>
								<Icon name="arrow-right" size="16" />
							</span>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{:else}
	<!-- 404 State -->
	<section class="section-spacing bg-white">
		<div class="container-custom text-center">
			<h1 class="text-4xl font-bold mb-4">Tratament negăsit</h1>
			<p class="text-xl text-gray-600 mb-8">
				Ne pare rău, dar tratamentul căutat nu a fost găsit.
			</p>
			<Button href="/tratamente" variant="primary" size="lg"> Vezi toate tratamentele </Button>
		</div>
	</section>
{/if}
