<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import ProblemCard from '$lib/components/molecules/ProblemCard.svelte';
	import { getProblemsByCategory } from '$lib/data/problems';

	const problemsCopii = getProblemsByCategory('copii');
	const problemsAdulti = getProblemsByCategory('adulti');
</script>

<svelte:head>
	<title>Ce Tratăm - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Tratăm o gamă largă de tulburări psihice pentru copii și adulți: autism, ADHD, anxietate, depresie, tulburări de somn și multe altele."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
				Ce <span class="text-primary">Tratăm</span>
			</h1>
			<p class="text-xl text-gray-700 leading-relaxed mb-8">
				Suntem specializați în diagnosticul și tratamentul tulburărilor de sănătate mentală,
				oferind îngrijire personalizată pentru fiecare pacient, indiferent de vârstă.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<a
					href="#copii"
					class="px-6 py-3 bg-secondary text-white rounded-full font-bold hover:bg-secondary/90 transition-colors"
				>
					Pentru Copii
				</a>
				<a
					href="#adulti"
					class="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
				>
					Pentru Adulți
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Copii Section -->
<section id="copii" class="section-spacing bg-white scroll-mt-20">
	<div class="container-custom">
		<div class="flex items-center gap-4 mb-8">
			<span class="px-4 py-2 bg-secondary text-white rounded-full text-sm font-bold">
				Pentru Copii
			</span>
			<div class="flex-1 h-px bg-secondary/20"></div>
		</div>

		<div class="max-w-3xl mb-12">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Îngrijire Specializată pentru Copii și Adolescenți
			</h2>
			<p class="text-lg text-gray-600">
				Copilăria este o perioadă critică de dezvoltare. Intervențiile timpurii pot face o diferență
				enormă în viața copilului. Echipa noastră de specialiști în psihiatrie pediatrică și
				psihologie clinică oferă evaluări complete și planuri de tratament personalizate.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each problemsCopii as problem}
				<ProblemCard
					title={problem.title}
					description={problem.shortDescription}
					href="/ce-tratam/{problem.slug}"
					icon={problem.icon}
					category="copii"
				/>
			{/each}
		</div>
	</div>
</section>

<!-- Adulți Section -->
<section id="adulti" class="section-spacing bg-gray-50 scroll-mt-20">
	<div class="container-custom">
		<div class="flex items-center gap-4 mb-8">
			<span class="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold">
				Pentru Adulți
			</span>
			<div class="flex-1 h-px bg-primary/20"></div>
		</div>

		<div class="max-w-3xl mb-12">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Suport Profesional pentru Adulți
			</h2>
			<p class="text-lg text-gray-600">
				Viața adultă vine cu propriile provocări - stres, anxietate, depresie, probleme de somn.
				Nu trebuie să le înfrunți singur. Oferim un spațiu sigur și confidențial unde poți primi
				ajutorul de care ai nevoie.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each problemsAdulti as problem}
				<ProblemCard
					title={problem.title}
					description={problem.shortDescription}
					href="/ce-tratam/{problem.slug}"
					icon={problem.icon}
					category="adulti"
				/>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section-spacing bg-gradient-to-br from-primary-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Nu ești sigur de unde să începi?
			</h2>
			<p class="text-lg text-gray-700 mb-8">
				Programează o consultație inițială cu unul dintre specialiștii noștri.
				Împreună vom identifica cea mai bună abordare pentru situația ta.
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
