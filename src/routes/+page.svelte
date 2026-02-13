<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import ProblemCard from '$lib/components/molecules/ProblemCard.svelte';

	const problems = [
		{
			title: 'Autism / TSA',
			description: 'Evaluare și intervenție timpurie pentru tulburările din spectrul autist.',
			href: '/ce-tratam/autism-tsa',
			icon: 'brain',
			category: 'copii' as const
		},
		{
			title: 'ADHD',
			description: 'Diagnostic și tratament pentru deficitul de atenție și hiperactivitate.',
			href: '/ce-tratam/adhd',
			icon: 'brain',
			category: 'copii' as const
		},
		{
			title: 'Anxietate la copii',
			description: 'Ajutor pentru copiii care se confruntă cu frici, griji și anxietate.',
			href: '/ce-tratam/anxietate-copii',
			icon: 'heart',
			category: 'copii' as const
		},
		{
			title: 'Depresie',
			description: 'Tratament complet pentru depresie și tulburări de dispoziție.',
			href: '/ce-tratam/depresie',
			icon: 'heart',
			category: 'adulti' as const
		},
		{
			title: 'Anxietate',
			description: 'Terapie pentru anxietate, atacuri de panică și fobii.',
			href: '/ce-tratam/anxietate',
			icon: 'heart',
			category: 'adulti' as const
		},
		{
			title: 'Tulburări de somn',
			description: 'Soluții pentru insomnie și alte probleme de somn.',
			href: '/ce-tratam/tulburari-somn',
			icon: 'brain',
			category: 'adulti' as const
		}
	];

	const services = [
		{
			title: 'Psihiatrie Adulți',
			icon: 'user',
			description: 'Diagnostic și tratament pentru tulburări psihiatrice la adulți.',
			href: '/servicii#psihiatrie-adulti',
			bgColor: 'bg-primary-light',
			textColor: 'text-primary-dark',
			iconBg: 'bg-primary'
		},
		{
			title: 'Psihiatrie Pediatrică',
			icon: 'child',
			description: 'Îngrijire specializată pentru copii și adolescenți.',
			href: '/servicii#psihiatrie-pediatrica',
			bgColor: 'bg-secondary-light',
			textColor: 'text-secondary-dark',
			iconBg: 'bg-secondary'
		},
		{
			title: 'Psihologie Clinică',
			icon: 'brain',
			description: 'Evaluări psihologice și consiliere specializată.',
			href: '/servicii#psihologie-clinica',
			bgColor: 'bg-accent-light',
			textColor: 'text-accent-dark',
			iconBg: 'bg-accent'
		},
		{
			title: 'Psihoterapie',
			icon: 'heart',
			description: 'Terapie individuală și de grup pentru diverse probleme.',
			href: '/servicii#psihoterapie',
			bgColor: 'bg-nature-light',
			textColor: 'text-nature-dark',
			iconBg: 'bg-nature'
		},
		{
			title: 'Evaluări Psihologice',
			icon: 'brain',
			description: 'Evaluări comprehensive cu instrumente diagnostice gold-standard.',
			href: '/evaluari-psihologice',
			bgColor: 'bg-accent-light',
			textColor: 'text-accent-dark',
			iconBg: 'bg-accent'
		},
		{
			title: 'Neurofeedback',
			icon: 'brain',
			description: 'Tratament modern pentru ADHD, anxietate și alte tulburări.',
			href: '/tratamente/neurofeedback',
			bgColor: 'bg-sunshine-light',
			textColor: 'text-gray-800',
			iconBg: 'bg-sunshine'
		},
		{
			title: 'Hipnoză Clinică',
			icon: 'brain',
			description: 'Terapie prin hipnoză pentru diverse afecțiuni.',
			href: '/tratamente/hipnoza-clinica',
			bgColor: 'bg-primary-light',
			textColor: 'text-primary-dark',
			iconBg: 'bg-primary'
		}
	];
</script>

<svelte:head>
	<title>Clinica Sf. Gherasim - Psihiatrie și Psihologie în Bacău</title>
	<meta
		name="description"
		content="Clinică de psihiatrie și psihologie în Bacău. Oferim tratamente moderne și personalizate pentru sănătatea ta mentală."
	/>
</svelte:head>

<!-- Hero Section - High Contrast -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-20 md:py-28">
	<!-- Decorative blobs - subtle -->
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div class="space-y-8">
				<div class="inline-block">
					<span class="bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg">
						✨ Îngrijire cu suflet pentru sănătatea ta mentală
					</span>
				</div>

				<h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900">
					Îngrijire
					<span class="text-primary">Psihiatrică</span>
					de Încredere
				</h1>

				<p class="text-xl md:text-2xl text-gray-700 leading-relaxed">
					Oferim tratamente moderne și personalizate pentru sănătatea ta mentală.
					Echipa noastră de specialiști îți stă la dispoziție cu căldură și profesionalism.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 pt-2">
					<Button href="/programare" variant="primary" size="lg">
						🗓️ Programează Consultație
					</Button>
					<Button href="/ce-tratam" variant="secondary" size="lg">
						Ce Tratăm
					</Button>
				</div>

				<!-- Trust Indicators -->
				<div class="flex flex-wrap gap-4 pt-4">
					<div class="flex items-center space-x-2 bg-white px-4 py-3 rounded-full shadow-md border-2 border-nature/20">
						<Icon name="check" size="20" class="text-nature" />
						<span class="text-sm font-bold text-gray-800">15+ ani experiență</span>
					</div>
					<div class="flex items-center space-x-2 bg-white px-4 py-3 rounded-full shadow-md border-2 border-accent/20">
						<Icon name="check" size="20" class="text-accent" />
						<span class="text-sm font-bold text-gray-800">Tratamente moderne</span>
					</div>
					<div class="flex items-center space-x-2 bg-white px-4 py-3 rounded-full shadow-md border-2 border-secondary/20">
						<Icon name="check" size="20" class="text-secondary" />
						<span class="text-sm font-bold text-gray-800">Echipă dedicată</span>
					</div>
				</div>
			</div>

			<!-- Hero Visual -->
			<div class="relative hidden md:block">
				<div class="relative aspect-square rounded-3xl bg-white border-4 border-primary/20 shadow-2xl p-12 hover:border-primary/40 transition-all duration-500">
					<div class="w-full h-full flex items-center justify-center">
						<div class="text-center">
							<div class="text-8xl mb-6">🧠✨</div>
							<p class="text-3xl font-black text-gray-900 mb-2">
								Sănătate Mentală
							</p>
							<p class="text-xl font-semibold text-gray-600">pentru toată familia</p>
						</div>
					</div>
				</div>

				<!-- Floating badges - removed duplicate/unclear labels -->
				<div class="absolute -top-6 -left-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-xl font-bold border-4 border-white">
					💝 Empatie
				</div>
				<div class="absolute -bottom-6 -right-6 text-white px-6 py-4 rounded-2xl shadow-xl font-bold border-4 border-white" style="background-color: #dd4444;">
					🌱 Vindecare
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section - Colorful Cards with Good Contrast -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">Serviciile Noastre</span>
			<h2 class="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900">
				Îngrijire Completă pentru
				<span class="text-primary">Sănătatea Ta</span>
			</h2>
			<p class="text-xl text-gray-700">
				Oferim o gamă completă de servicii de psihiatrie și psihologie pentru adulți și copii.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each services as service}
				<a
					href={service.href}
					class="group relative {service.bgColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-3 border-{service.iconBg.replace('bg-', '')}"
				>
					<!-- Content with high contrast -->
					<h3 class="text-2xl font-bold mb-3 {service.textColor} flex items-center gap-2">
						<Icon name={service.icon} size="24" class="{service.textColor}" />
						{service.title}
					</h3>
					<p class="text-gray-800 mb-6 leading-relaxed font-medium">{service.description}</p>

					<!-- CTA -->
					<div class="flex items-center space-x-2 {service.textColor} font-bold group-hover:translate-x-2 transition-transform">
						<span>Află mai mult</span>
						<Icon name="arrow-right" size="16" />
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section - Dark Background with White Text -->
<section class="section-spacing bg-gray-900 text-white relative overflow-hidden">
	<!-- Subtle decorative elements -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
	</div>

	<div class="container-custom relative z-10">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-black mb-4 text-white">De ce să ne alegi?</h2>
			<p class="text-xl text-gray-300">Cifre care vorbesc despre dedicarea noastră</p>
		</div>

		<div class="grid md:grid-cols-4 gap-8">
			{#each [ { number: '15+', label: 'Ani de experiență', icon: '🏆', color: 'bg-primary' }, { number: '5000+', label: 'Pacienți fericiți', icon: '😊', color: 'bg-nature' }, { number: '10+', label: 'Servicii specializate', icon: '🎯', color: 'bg-accent' }, { number: '95%', label: 'Satisfacție pacienți', icon: '⭐', color: 'bg-sunshine' } ] as stat}
				<div class="text-center bg-white/5 backdrop-blur rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-white/10">
					<div class="inline-flex items-center justify-center w-20 h-20 {stat.color} rounded-2xl mb-4 text-3xl">
						{stat.icon}
					</div>
					<div class="text-5xl md:text-6xl font-black mb-2 text-white">{stat.number}</div>
					<div class="text-lg font-semibold text-gray-300">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Problems Section - What We Treat -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">Ce Tratăm</span>
			<h2 class="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900">
				Probleme Frecvente pe Care le
				<span class="text-primary">Tratăm</span>
			</h2>
			<p class="text-xl text-gray-700">
				Suntem specializați în diagnosticul și tratamentul unei game largi de tulburări psihice, atât pentru copii cât și pentru adulți.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each problems as problem}
				<ProblemCard
					title={problem.title}
					description={problem.description}
					href={problem.href}
					icon={problem.icon}
					category={problem.category}
				/>
			{/each}
		</div>

		<div class="text-center mt-12">
			<Button href="/ce-tratam" variant="secondary" size="md">
				Vezi toate problemele pe care le tratăm
			</Button>
		</div>
	</div>
</section>

<!-- CTA Section - Warm Background with Dark Text -->
<section class="section-spacing bg-gradient-to-br from-primary-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center border-4 border-primary/10">
			<div class="text-6xl mb-6">🌟</div>
			<h2 class="text-4xl md:text-5xl font-black mb-6 text-gray-900">
				Gata să faci primul pas?
			</h2>
			<p class="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
				Programează o consultație astăzi și începe călătoria către o sănătate mentală mai bună.
				Suntem aici pentru tine! 💙
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare" variant="primary" size="lg">
					📅 Programează-te Acum
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					💬 Contactează-ne
				</Button>
			</div>
		</div>
	</div>
</section>
