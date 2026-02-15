<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import SpecialistCard from '$lib/components/molecules/SpecialistCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Echipa Noastră de Specialiști - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Cunoaște echipa de psihiatri, psihologi și terapeuți de la Clinica Sf. Gherasim. Profesioniști dedicați sănătății tale mentale."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
				Echipa Noastră de <span class="text-primary">Specialiști</span>
			</h1>
			<p class="text-xl text-gray-700 leading-relaxed mb-8">
				Suntem o echipă de profesioniști dedicați sănătății tale mentale. Fiecare specialist
				din echipa noastră aduce expertiză, empatie și angajament în îngrijirea pacienților.
			</p>
			<Button href="/programare" variant="primary" size="lg">
				Programează o consultație
			</Button>
		</div>
	</div>
</section>

<!-- Stats -->
<section class="py-12 bg-gray-900 text-white">
	<div class="container-custom">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
			<div>
				<div class="text-4xl font-black text-primary mb-2">{data.specialists.length}</div>
				<div class="text-gray-300">Specialiști</div>
			</div>
			<div>
				<div class="text-4xl font-black text-secondary mb-2">15+</div>
				<div class="text-gray-300">Ani experiență medie</div>
			</div>
			<div>
				<div class="text-4xl font-black text-accent mb-2">5000+</div>
				<div class="text-gray-300">Pacienți tratați</div>
			</div>
			<div>
				<div class="text-4xl font-black text-nature mb-2">95%</div>
				<div class="text-gray-300">Satisfacție</div>
			</div>
		</div>
	</div>
</section>

<!-- Category Legend -->
<section class="py-6 bg-white border-b border-gray-100">
	<div class="container-custom">
		<div class="flex flex-wrap items-center justify-center gap-6">
			<span class="text-sm text-gray-500 font-medium">Filtrează după specialitate:</span>
			<div class="flex flex-wrap gap-3">
				<span class="flex items-center gap-2 text-sm">
					<span class="w-3 h-3 rounded-full bg-primary"></span>
					Psihiatri
				</span>
				<span class="flex items-center gap-2 text-sm">
					<span class="w-3 h-3 rounded-full bg-secondary"></span>
					Psihologi
				</span>
				<span class="flex items-center gap-2 text-sm">
					<span class="w-3 h-3 rounded-full bg-accent"></span>
					Psihoterapeuți
				</span>
				<span class="flex items-center gap-2 text-sm">
					<span class="w-3 h-3 rounded-full bg-nature"></span>
					Alți Specialiști
				</span>
			</div>
		</div>
	</div>
</section>

<!-- All Specialists Grid -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		{#if data.specialists.length > 0}
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.specialists as specialist}
					<SpecialistCard
						name={specialist.name}
						title={specialist.title}
						specialties={specialist.specialties}
						description={specialist.description}
						image={specialist.image}
						bookingParam={specialist.id}
						category={specialist.category}
					/>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">Nu există specialiști disponibili momentan.</p>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="section-spacing bg-gradient-to-br from-primary-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Gata să faci primul pas?
			</h2>
			<p class="text-lg text-gray-700 mb-8">
				Alege specialistul potrivit pentru nevoile tale și programează o consultație.
				Suntem aici să te ajutăm.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare" variant="primary" size="lg">
					Programează o consultație
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					Contactează-ne
				</Button>
			</div>
		</div>
	</div>
</section>
