<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';

	let { data } = $props();
	const cms = data?.cms;

	// Helpers — split title into prefix + accent so the colored span
	// renders the same way it always has.
	function splitTitle(title: string | undefined, accent: string | undefined) {
		if (!title) return null;
		if (!accent || !title.includes(accent)) return { prefix: title, accent: '' };
		const idx = title.indexOf(accent);
		return {
			prefix: title.slice(0, idx).trimEnd(),
			accent
		};
	}
	const heroSplit = splitTitle(cms?.heroTitle, cms?.heroTitleAccent);

	// Defaults map color theme strings to Tailwind classes for stat numbers
	// and value icons. Static literals so v4 scanner picks them up.
	const colorTextClass: Record<string, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		accent: 'text-accent',
		nature: 'text-nature'
	};
	const colorBgTintClass: Record<string, string> = {
		primary: 'bg-primary/10',
		secondary: 'bg-secondary/10',
		accent: 'bg-accent/10',
		nature: 'bg-nature/10'
	};

	// --- Fallback data (matches the previous hardcoded layout) ---------
	const fallbackStats = [
		{ value: '15+', label: 'Ani de experiență', color: 'primary' },
		{ value: '5000+', label: 'Pacienți ajutați', color: 'secondary' },
		{ value: '10+', label: 'Servicii specializate', color: 'accent' },
		{ value: '95%', label: 'Satisfacție pacienți', color: 'nature' }
	];

	const fallbackValues = [
		{ iconName: 'heart', title: 'Empatie', description: 'Ascultăm cu atenție și înțelegem provocările fiecărui pacient', color: 'primary' },
		{ iconName: 'brain', title: 'Excelență', description: 'Ne dedicăm formării continue și celor mai bune practici', color: 'secondary' },
		{ iconName: 'check', title: 'Integritate', description: 'Acționăm etic și transparent în toate interacțiunile', color: 'accent' },
		{ iconName: 'user', title: 'Respect', description: 'Tratăm fiecare persoană cu demnitate și confidențialitate', color: 'nature' }
	];

	const fallbackWhyChooseUs = [
		{ iconName: 'user', title: 'Echipă Experimentată', description: 'Specialiști cu ani de experiență și formare continuă în cele mai noi metode de tratament.' },
		{ iconName: 'brain', title: 'Tratamente Moderne', description: 'Acces la terapii inovatoare precum neurofeedback, alături de metodele clasice validate.' },
		{ iconName: 'heart', title: 'Abordare Personalizată', description: 'Fiecare plan de tratament este creat specific pentru nevoile și obiectivele tale.' },
		{ iconName: 'check', title: 'Rezultate Dovedite', description: 'Rate ridicate de succes și satisfacție confirmată de pacienții noștri.' },
		{ iconName: 'calendar', title: 'Program Flexibil', description: 'Programări convenabile, inclusiv sâmbăta, pentru a ne adapta stilului tău de viață.' },
		{ iconName: 'phone', title: 'Suport Continuu', description: 'Suntem alături de tine pe tot parcursul procesului de vindecare.' }
	];

	const stats = cms?.stats?.length ? cms.stats : fallbackStats;
	const values = cms?.values?.length ? cms.values : fallbackValues;
	const whyChooseUs = cms?.whyChooseUsItems?.length ? cms.whyChooseUsItems : fallbackWhyChooseUs;
</script>

<svelte:head>
	<title>{cms?.heroTitle ?? 'Despre Noi'} - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Clinica Sf. Gherasim - PSIMED oferă servicii de psihiatrie și psihologie în Bacău de peste 15 ani. Descoperă povestea, misiunea și valorile noastre."
	/>
</svelte:head>

<!-- 1. Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-24">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="max-w-4xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
				{#if heroSplit}
					{heroSplit.prefix}
					{#if heroSplit.accent}
						{' '}<span class="text-primary">{heroSplit.accent}</span>
					{/if}
				{:else}
					Despre <span class="text-primary">Clinica Sf. Gherasim</span>
				{/if}
			</h1>
			<p class="text-xl text-gray-700 leading-relaxed mb-8">
				{cms?.heroLead ?? 'De peste 15 ani, suntem dedicați îmbunătățirii sănătății mentale a comunității din Bacău și împrejurimi. Oferim servicii medicale de înaltă calitate într-un mediu sigur și primitor.'}
			</p>
			<div class="flex flex-wrap gap-4">
				<Button href="/specialisti" variant="primary" size="lg">Cunoaște Echipa</Button>
				<Button href="/programare" variant="secondary" size="lg">Programează o Consultație</Button>
			</div>
		</div>
	</div>
</section>

<!-- 2. Stats -->
<section class="py-12 bg-gray-900 text-white">
	<div class="container-custom">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
			{#each stats as stat}
				<div>
					<div class="text-4xl font-black mb-2 {colorTextClass[stat.color ?? 'primary'] ?? 'text-primary'}">
						{stat.value}
					</div>
					<div class="text-gray-300">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- 3. Story -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<span class="text-primary font-bold text-sm uppercase tracking-wider">
					{cms?.storyEyebrow ?? 'Povestea Noastră'}
				</span>
				<h2 class="text-3xl md:text-4xl font-black mt-2 mb-6 text-gray-900">
					{cms?.storyTitle ?? 'O Clinică Născută din Pasiune'}
				</h2>
				{#if cms?.storyBody && cms.storyBody.length > 0}
					<div class="space-y-4 text-lg text-gray-700">
						<PortableBody value={cms.storyBody} />
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
						"{cms?.storyQuoteText ?? 'Credem că sănătatea mentală este la fel de importantă ca sănătatea fizică. Fiecare persoană merită acces la îngrijire de calitate.'}"
					</blockquote>
					<p class="text-white/80">
						— {cms?.storyQuoteAttribution ?? 'Filosofia Clinicii Sf. Gherasim'}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 4. Mission & Vision -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">
				{cms?.missionVisionEyebrow ?? 'Misiune & Viziune'}
			</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				{cms?.missionVisionTitle ?? 'Ce Ne Ghidează'}
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-primary">
				<div class="text-4xl mb-4">🎯</div>
				<h3 class="text-2xl font-bold mb-4 text-gray-900">Misiunea Noastră</h3>
				<p class="text-gray-700 leading-relaxed whitespace-pre-line">
					{cms?.missionText ?? 'Să oferim servicii de sănătate mentală accesibile, bazate pe dovezi științifice, într-un mediu sigur și confidențial. Ne angajăm să tratăm fiecare pacient cu respect, empatie și profesionalism, ajutându-l să-și recapete echilibrul și calitatea vieții.'}
				</p>
			</div>

			<div class="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-secondary">
				<div class="text-4xl mb-4">🌟</div>
				<h3 class="text-2xl font-bold mb-4 text-gray-900">Viziunea Noastră</h3>
				<p class="text-gray-700 leading-relaxed whitespace-pre-line">
					{cms?.visionText ?? 'Să devenim un centru de referință pentru sănătatea mentală în regiunea Moldovei, recunoscut pentru excelența clinică, abordarea inovatoare și impactul pozitiv în comunitate. Visăm la o lume în care nimeni nu suferă în tăcere.'}
				</p>
			</div>
		</div>
	</div>
</section>

<!-- 5. Values -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">
				{cms?.valuesEyebrow ?? 'Valorile Noastre'}
			</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				{cms?.valuesTitle ?? 'Principiile Care Ne Definesc'}
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each values as value}
				<div class="text-center p-6">
					<div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 {colorBgTintClass[value.color ?? 'primary'] ?? 'bg-primary/10'}">
						<Icon name={value.iconName} size="32" class={colorTextClass[value.color ?? 'primary'] ?? 'text-primary'} />
					</div>
					<h3 class="text-lg font-bold mb-2 text-gray-900">{value.title}</h3>
					<p class="text-gray-600 text-sm">{value.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- 6. Why Choose Us -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<span class="text-primary font-bold text-sm uppercase tracking-wider">
				{cms?.whyChooseUsEyebrow ?? 'De Ce Noi'}
			</span>
			<h2 class="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
				{cms?.whyChooseUsTitle ?? 'Ce Ne Face Diferiți'}
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each whyChooseUs as feature}
				<div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
							<Icon name={feature.iconName} size="24" class="text-white" />
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

<!-- Team CTA (NU editabil — link-uri fixe către /specialisti) -->
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

<!-- CTA Section (NU editabil — link-uri fixe către /programare, /contact) -->
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
