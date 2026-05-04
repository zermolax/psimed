<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';

	let { data } = $props();
	const cms = data?.cms;
</script>

<svelte:head>
	<title>{cms?.heroTitle ?? 'Despre Noi'} - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Clinica Sf. Gherasim - PSIMED oferă servicii de psihiatrie și psihologie în Bacău de peste 15 ani. Descoperă povestea, misiunea și valorile noastre."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl">
			{#if cms?.heroTitle}
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
					{cms.heroTitle}
				</h1>
			{:else}
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
					Despre <span class="text-primary">Clinica Sf. Gherasim</span>
				</h1>
			{/if}
			<p class="text-xl text-gray-700 leading-relaxed mb-8">
				{cms?.heroLead ?? 'De peste 15 ani, suntem dedicați îmbunătățirii sănătății mentale a comunității din Bacău și împrejurimi. Oferim servicii medicale de înaltă calitate într-un mediu sigur și primitor.'}
			</p>
			<div class="flex flex-wrap gap-4">
				<Button href="/specialisti" variant="primary" size="lg">
					Cunoaște Echipa
				</Button>
				<Button href="/programare" variant="secondary" size="lg">
					Programează o Consultație
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Stats -->
<section class="py-12 bg-gray-900 text-white">
	<div class="container-custom">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
			<div>
				<div class="text-4xl font-black text-primary mb-2">15+</div>
				<div class="text-gray-300">Ani de experiență</div>
			</div>
			<div>
				<div class="text-4xl font-black text-secondary mb-2">5000+</div>
				<div class="text-gray-300">Pacienți ajutați</div>
			</div>
			<div>
				<div class="text-4xl font-black text-accent mb-2">10+</div>
				<div class="text-gray-300">Servicii specializate</div>
			</div>
			<div>
				<div class="text-4xl font-black text-nature mb-2">95%</div>
				<div class="text-gray-300">Satisfacție pacienți</div>
			</div>
		</div>
	</div>
</section>

<!-- Our Story -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<span class="text-primary font-bold text-sm uppercase tracking-wider">Povestea Noastră</span>
				<h2 class="text-3xl md:text-4xl font-black mt-2 mb-6 text-gray-900">
					O Clinică Născută din Pasiune
				</h2>
				{#if cms?.body && cms.body.length > 0}
					<div class="space-y-4 text-lg text-gray-700">
						<PortableBody value={cms.body} />
					</div>
				{:else}
					<div class="space-y-4 text-lg text-gray-700">
						<p>
							Clinica Sf. Gherasim - PSIMED a fost înființată cu o viziune clară: să aducem servicii
							de sănătate mentală de calitate în regiunea Moldovei, într-un mediu lipsit de stigmatizare.
						</p>
						<p>
							Am pornit de la un cabinet modest, dar cu o mare dorință de a ajuta. Astăzi, am crescut
							într-o clinică completă, oferind o gamă largă de servicii - de la psihiatrie și
							psihologie clinică până la terapii moderne precum neurofeedback.
						</p>
						<p>
							Fiecare pas al acestei călătorii a fost ghidat de pacienții noștri și de nevoile lor.
							Ei sunt în centrul a tot ceea ce facem.
						</p>
					</div>
				{/if}
			</div>
			<div class="relative">
				<div class="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 text-white">
					<div class="text-7xl mb-6">🏥</div>
					<blockquote class="text-xl font-medium italic mb-4">
						"Credem că sănătatea mentală este la fel de importantă ca sănătatea fizică.
						Fiecare persoană merită acces la îngrijire de calitate."
					</blockquote>
					<p class="text-white/80">— Filosofia Clinicii Sf. Gherasim</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Mission & Vision -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">Misiune & Viziune</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				Ce Ne Ghidează
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-primary">
				<div class="text-4xl mb-4">🎯</div>
				<h3 class="text-2xl font-bold mb-4 text-gray-900">Misiunea Noastră</h3>
				<p class="text-gray-700 leading-relaxed">
					Să oferim servicii de sănătate mentală accesibile, bazate pe dovezi științifice,
					într-un mediu sigur și confidențial. Ne angajăm să tratăm fiecare pacient cu
					respect, empatie și profesionalism, ajutându-l să-și recapete echilibrul și
					calitatea vieții.
				</p>
			</div>

			<div class="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-secondary">
				<div class="text-4xl mb-4">🌟</div>
				<h3 class="text-2xl font-bold mb-4 text-gray-900">Viziunea Noastră</h3>
				<p class="text-gray-700 leading-relaxed">
					Să devenim un centru de referință pentru sănătatea mentală în regiunea Moldovei,
					recunoscut pentru excelența clinică, abordarea inovatoare și impactul pozitiv
					în comunitate. Visăm la o lume în care nimeni nu suferă în tăcere.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Our Values -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">Valorile Noastre</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				Principiile Care Ne Definesc
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="text-center p-6">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<Icon name="heart" size="32" class="text-primary" />
				</div>
				<h3 class="text-lg font-bold mb-2 text-gray-900">Empatie</h3>
				<p class="text-gray-600 text-sm">
					Ascultăm cu atenție și înțelegem provocările fiecărui pacient
				</p>
			</div>

			<div class="text-center p-6">
				<div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<Icon name="brain" size="32" class="text-secondary" />
				</div>
				<h3 class="text-lg font-bold mb-2 text-gray-900">Excelență</h3>
				<p class="text-gray-600 text-sm">
					Ne dedicăm formării continue și celor mai bune practici
				</p>
			</div>

			<div class="text-center p-6">
				<div class="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<Icon name="check" size="32" class="text-accent" />
				</div>
				<h3 class="text-lg font-bold mb-2 text-gray-900">Integritate</h3>
				<p class="text-gray-600 text-sm">
					Acționăm etic și transparent în toate interacțiunile
				</p>
			</div>

			<div class="text-center p-6">
				<div class="w-16 h-16 bg-nature/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<Icon name="user" size="32" class="text-nature" />
				</div>
				<h3 class="text-lg font-bold mb-2 text-gray-900">Respect</h3>
				<p class="text-gray-600 text-sm">
					Tratăm fiecare persoană cu demnitate și confidențialitate
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Why Choose Us -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">De Ce Noi</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				Ce Ne Face Diferiți
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [
				{ icon: 'user', title: 'Echipă Experimentată', description: 'Specialiști cu ani de experiență și formare continuă în cele mai noi metode de tratament.' },
				{ icon: 'brain', title: 'Tratamente Moderne', description: 'Acces la terapii inovatoare precum neurofeedback, alături de metodele clasice validate.' },
				{ icon: 'heart', title: 'Abordare Personalizată', description: 'Fiecare plan de tratament este creat specific pentru nevoile și obiectivele tale.' },
				{ icon: 'check', title: 'Rezultate Dovedite', description: 'Rate ridicate de succes și satisfacție confirmată de pacienții noștri.' },
				{ icon: 'calendar', title: 'Program Flexibil', description: 'Programări convenabile, inclusiv sâmbăta, pentru a ne adapta stilului tău de viață.' },
				{ icon: 'phone', title: 'Suport Continuu', description: 'Suntem alături de tine pe tot parcursul procesului de vindecare.' }
			] as feature}
				<div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
							<Icon name={feature.icon} size="24" class="text-white" />
						</div>
						<div>
							<h3 class="font-bold mb-2 text-gray-900">{feature.title}</h3>
							<p class="text-sm text-gray-600">{feature.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Team CTA -->
<section class="section-spacing bg-gradient-to-br from-primary to-primary-dark text-white">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black mb-4">
				Cunoaște Echipa Noastră
			</h2>
			<p class="text-xl text-white/90 mb-8">
				În spatele fiecărei povești de succes se află profesioniști dedicați.
				Descoperă specialiștii care te pot ajuta.
			</p>
			<Button href="/specialisti" variant="secondary" size="lg" class="bg-white text-primary hover:bg-gray-100">
				Vezi Specialiștii
			</Button>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
				Gata să Începem Împreună?
			</h2>
			<p class="text-lg text-gray-700 mb-8">
				Fă primul pas către o sănătate mentală mai bună. Programează o consultație
				și descoperă cum te putem ajuta.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare" variant="primary" size="lg">
					Programează Consultație
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					Contactează-ne
				</Button>
			</div>
		</div>
	</div>
</section>
