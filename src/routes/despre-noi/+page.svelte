<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import teamData from '../../content/data/team.json';
</script>

<svelte:head>
	<title>Despre Noi - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Clinica Sf. Gherasim - PSIMED oferă servicii de psihiatrie și psihologie în Bacău de peste 15 ani. Echipă de specialiști dedicați sănătății tale mentale."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Despre Noi</h1>
			<p class="text-xl text-gray-700 leading-relaxed">
				Clinica Sf. Gherasim - PSIMED este dedicată îmbunătățirii sănătății mentale a comunității
				din Bacău și împrejurimi prin servicii medicale de înaltă calitate și o abordare empatică.
			</p>
		</div>
	</div>
</section>

<!-- Our Story -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Povestea noastră</h2>
				<div class="space-y-4 text-lg text-gray-700">
					<p>
						Clinica Sf. Gherasim - PSIMED a fost înființată cu misiunea de a oferi servicii de
						sănătate mentală accesibile și de calitate în regiunea Moldovei. De peste 15 ani, ajutăm
						pacienți să depășească provocările legate de sănătatea mentală.
					</p>
					<p>
						Am crescut de la un cabinet modest la o clinică completă, oferind o gamă largă de
						servicii - de la psihiatrie și psihologie clinică până la terapii moderne precum
						neurofeedback și stimulare transcraniană.
					</p>
					<p>
						Credem că fiecare persoană merită acces la îngrijire de calitate pentru sănătatea
						mentală, într-un mediu sigur, confidențial și lipsit de stigmatizare.
					</p>
				</div>
			</div>
			<div class="bg-gray-900 rounded-3xl aspect-square flex items-center justify-center">
				<div class="text-center text-white p-8">
					<div class="text-6xl mb-4">🏥</div>
					<p class="text-2xl font-bold">15+ ani</p>
					<p class="text-lg">de dedicare</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Our Values -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Valorile noastre</h2>
		<div class="grid md:grid-cols-3 gap-8">
			<div class="bg-white rounded-xl p-8 border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-6">
					<Icon name="heart" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Empatie și Compasiune</h3>
				<p class="text-gray-700">
					Tratăm fiecare pacient cu respect, înțelegere și empatie, creând un spațiu sigur pentru
					vindecare.
				</p>
			</div>

			<div class="bg-white rounded-xl p-8 border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-6">
					<Icon name="brain" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Excelență Profesională</h3>
				<p class="text-gray-700">
					Echipa noastră se dedică formării continue și aplicării celor mai bune practici în
					domeniu.
				</p>
			</div>

			<div class="bg-white rounded-xl p-8 border-2 border-gray-200">
				<div class="inline-block p-4 bg-gray-900 rounded-2xl mb-6">
					<Icon name="check" size="32" class="text-white" />
				</div>
				<h3 class="text-xl font-bold mb-3 text-gray-900">Abordare Bazată pe Dovezi</h3>
				<p class="text-gray-700">
					Folosim metode validate științific și ne adaptăm constant la noile descoperiri din
					cercetare.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Our Team -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Echipa noastră</h2>
			<p class="text-xl text-gray-700 max-w-2xl mx-auto">
				Profesioniști dedicați cu experiență vastă în sănătatea mentală
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			{#each teamData as member}
				<div class="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
					<!-- Avatar placeholder -->
					<div class="w-32 h-32 bg-gray-900 rounded-full mb-6 mx-auto flex items-center justify-center text-white text-5xl font-bold">
						{member.name.charAt(0)}
					</div>

					<!-- Info -->
					<div class="text-center mb-6">
						<h3 class="text-2xl font-bold mb-1 text-gray-900">{member.name}</h3>
						<p class="text-gray-900 font-bold mb-2">{member.role}</p>
						<p class="text-sm text-gray-700">{member.specialty}</p>
					</div>

					<!-- Description -->
					<p class="text-gray-700 mb-6 leading-relaxed">{member.description}</p>

					<!-- Qualifications -->
					<div class="border-t border-gray-200 pt-6">
						<h4 class="font-semibold mb-3 text-gray-900">Calificări:</h4>
						<ul class="space-y-2">
							{#each member.qualifications as qualification}
								<li class="flex items-start space-x-2 text-sm text-gray-700">
									<Icon name="check" size="16" class="text-nature flex-shrink-0 mt-0.5" />
									<span>{qualification}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="section-spacing bg-gray-900 text-white">
	<div class="container-custom">
		<div class="grid md:grid-cols-4 gap-8 text-center">
			<div>
				<div class="text-5xl font-bold mb-2 text-white">15+</div>
				<div class="text-lg text-gray-200">Ani de experiență</div>
			</div>
			<div>
				<div class="text-5xl font-bold mb-2 text-white">5000+</div>
				<div class="text-lg text-gray-200">Pacienți tratați</div>
			</div>
			<div>
				<div class="text-5xl font-bold mb-2 text-white">10+</div>
				<div class="text-lg text-gray-200">Servicii specializate</div>
			</div>
			<div>
				<div class="text-5xl font-bold mb-2 text-white">95%</div>
				<div class="text-lg text-gray-200">Satisfacție pacienți</div>
			</div>
		</div>
	</div>
</section>

<!-- Why Choose Us -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">De ce Clinica Sf. Gherasim?</h2>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [ { icon: 'user', title: 'Echipă Experimentată', description: 'Specialiști cu experiență vastă și formare continuă' }, { icon: 'brain', title: 'Tratamente Moderne', description: 'Acces la cele mai noi metode de tratament validate științific' }, { icon: 'heart', title: 'Abordare Personalizată', description: 'Fiecare plan de tratament este adaptat nevoilor tale' }, { icon: 'check', title: 'Rezultate Dovedite', description: 'Rate ridicate de succes și satisfacție a pacienților' }, { icon: 'calendar', title: 'Program Flexibil', description: 'Programări convenabile, inclusiv sâmbăta' }, { icon: 'phone', title: 'Suport Continuu', description: 'Echipa noastră este disponibilă pentru tine' } ] as feature}
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
						<Icon name={feature.icon} size="24" class="text-white" />
					</div>
					<div>
						<h3 class="font-bold mb-1 text-gray-900">{feature.title}</h3>
						<p class="text-sm text-gray-700">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom text-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Gata să începem împreună?</h2>
		<p class="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
			Fă primul pas către o sănătate mentală mai bună. Programează o consultație și descoperă cum
			te putem ajuta.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<Button href="/programare" variant="primary" size="lg"> Programează Consultație </Button>
			<Button href="/contact" variant="outline" size="lg"> Contactează-ne </Button>
		</div>
	</div>
</section>
