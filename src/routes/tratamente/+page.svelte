<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import treatmentsData from '../../content/data/treatments.json';
</script>

<svelte:head>
	<title>Tratamente Moderne - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Tratamente moderne pentru depresie, anxietate, ADHD, autism. Neurofeedback, stimulare transcraniană, hipnoză clinică și psihoterapie în Bacău."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Tratamente Moderne</h1>
			<p class="text-xl text-gray-700 leading-relaxed">
				Folosim cele mai moderne metode de tratament, bazate pe dovezi științifice, pentru a oferi
				cele mai bune rezultate pacienților noștri.
			</p>
		</div>
	</div>
</section>

<!-- Treatments Grid -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each treatmentsData as treatment}
				<div
					class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col"
				>
					<!-- Icon & Title -->
					<div class="inline-block p-3 bg-gray-900 rounded-2xl mb-4">
						<Icon name={treatment.icon} size="48" class="text-white" />
					</div>
					<h2 class="text-2xl font-bold mb-3 text-gray-900">{treatment.title}</h2>
					<p class="text-gray-600 mb-4 flex-grow">{treatment.description}</p>

					<!-- Quick Stats -->
					<div class="space-y-2 mb-6 text-sm">
						<div class="flex items-start space-x-2">
							<Icon name="calendar" size="16" class="text-gray-700 mt-0.5" />
							<span class="text-gray-700"
								><strong>Durată:</strong>
								{treatment.duration}</span
							>
						</div>
						<div class="flex items-start space-x-2">
							<Icon name="check" size="16" class="text-nature mt-0.5" />
							<span class="text-gray-700"
								><strong>Frecvență:</strong>
								{treatment.frequency}</span
							>
						</div>
					</div>

					<!-- CTA -->
					<div class="flex flex-col sm:flex-row gap-3 mt-auto">
						<Button href="/tratamente/{treatment.slug}" variant="primary" size="sm" class="flex-1">
							Detalii
						</Button>
						<Button href="/programare?treatment={treatment.slug}" variant="outline" size="sm">
							Programează
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Why Choose Modern Treatments -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900">De ce tratamente moderne?</h2>
			<p class="text-xl text-gray-700">
				Tratamentele moderne oferă alternative sigure și eficiente, adesea cu mai puține efecte
				adverse decât metodele tradiționale.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			<div class="bg-white rounded-xl p-8 text-center border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-4">
					<Icon name="check" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Bazate pe Dovezi</h3>
				<p class="text-gray-700">
					Toate tratamentele noastre sunt susținute de studii științifice și ghiduri clinice
					internaționale.
				</p>
			</div>

			<div class="bg-white rounded-xl p-8 text-center border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-4">
					<Icon name="heart" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Personalizate</h3>
				<p class="text-gray-700">
					Fiecare plan de tratament este adaptat nevoilor individuale ale pacientului.
				</p>
			</div>

			<div class="bg-white rounded-xl p-8 text-center border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-4">
					<Icon name="brain" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Eficiente</h3>
				<p class="text-gray-700">
					Rate ridicate de succes și îmbunătățiri semnificative în calitatea vieții.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section-spacing bg-gray-900 text-white">
	<div class="container-custom text-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">
			Găsește tratamentul potrivit pentru tine
		</h2>
		<p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
			Nu ești sigur ce tratament este potrivit pentru tine? Programează o consultație inițială și
			te vom ajuta să găsești cea mai bună soluție.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<Button href="/programare" variant="primary" size="lg"> Programează Consultație </Button>
			<Button href="/contact" variant="secondary" size="lg">
				Pune o Întrebare
			</Button>
		</div>
	</div>
</section>
