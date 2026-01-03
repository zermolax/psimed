<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	// Preluăm parametrii din URL (de exemplu: /programare?treatment=neurofeedback&service=psihiatrie)
	let treatment = $derived($page.url.searchParams.get('treatment'));
	let service = $derived($page.url.searchParams.get('service'));

	const specialists = [
		{
			name: 'Dr. Gheorghe Gherasim',
			role: 'Medic Primar Psihiatru',
			specialties: ['Psihiatrie Adulți', 'Psihoterapie', 'Tulburări Afective'],
			available: 'Luni, Miercuri, Vineri'
		},
		{
			name: 'Dr. Maria Popescu',
			role: 'Medic Specialist Psihiatru Pediatru',
			specialties: ['Psihiatrie Pediatrică', 'ADHD', 'Autism'],
			available: 'Marți, Joi, Sâmbătă'
		},
		{
			name: 'Psih. Ana Ionescu',
			role: 'Psiholog Clinician',
			specialties: ['Evaluări Psihologice', 'Consiliere', 'TCC'],
			available: 'Luni - Vineri'
		},
		{
			name: 'Psih. Mihai Dumitrescu',
			role: 'Psihoterapeut',
			specialties: ['Psihoterapie', 'Hipnoză Clinică', 'Mindfulness'],
			available: 'Luni - Vineri'
		}
	];

	const consultationTypes = [
		{
			title: 'Prima Consultație',
			duration: '60 minute',
			description: 'Evaluare completă și stabilirea planului de tratament',
			icon: 'user'
		},
		{
			title: 'Consultație Follow-up',
			duration: '30 minute',
			description: 'Monitorizare și ajustare tratament',
			icon: 'check'
		},
		{
			title: 'Consultație Pediatrică',
			duration: '45 minute',
			description: 'Evaluare și consultație pentru copii și adolescenți',
			icon: 'child'
		},
		{
			title: 'Ședință Psihoterapie',
			duration: '50 minute',
			description: 'Ședință individuală de psihoterapie',
			icon: 'heart'
		}
	];
</script>

<svelte:head>
	<title>Programare Online - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Programează o consultație online la Clinica Sf. Gherasim. Sistem rapid și simplu de rezervare pentru servicii de psihiatrie și psihologie."
	/>
	<!-- Cal.com Embed Script -->
	<script type="text/javascript">
		(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.eu/embed/embed.js", "init");
		Cal("init", "psihoterapie", {origin:"https://app.cal.eu"});

		Cal.ns.psihoterapie("inline", {
			elementOrSelector:"#my-cal-inline-psihoterapie",
			config: {"layout":"month_view"},
			calLink: "iermolai/psihoterapie",
		});

		Cal.ns.psihoterapie("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
	</script>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-6">Programare Online</h1>
			<p class="text-xl text-gray-600 leading-relaxed mb-8">
				Alege specialistul și tipul de consultație potrivit pentru nevoile tale. Sistemul nostru
				online îți permite să faci programări rapid și simplu.
			</p>

			{#if treatment}
				<div class="inline-block bg-white rounded-lg px-6 py-3 shadow-md">
					<p class="text-sm text-gray-600">Programare pentru:</p>
					<p class="text-lg font-bold text-primary capitalize">{treatment.replace('-', ' ')}</p>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Cal.com Booking Widget -->
<section class="section-spacing bg-white">
	<div class="container-custom max-w-5xl">
		<!-- Cal.com Embedded Booking -->
		<div class="bg-white rounded-xl shadow-lg p-4 mb-12">
			<!-- Cal inline embed code begins -->
			<div style="width:100%;height:100%;min-height:700px;overflow:scroll" id="my-cal-inline-psihoterapie"></div>
			<!-- Cal inline embed code ends -->
		</div>

		<!-- Alternative Booking Methods -->
		<div class="text-center mb-12">
			<h2 class="text-2xl font-bold mb-4">Între timp, programează-te telefonic sau prin email</h2>
			<div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
				<a
					href="tel:+40711039666"
					class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
				>
					<Icon name="phone" size="32" class="mx-auto mb-3 text-primary" />
					<h3 class="font-bold mb-2">Telefon</h3>
					<p class="text-primary text-lg font-medium">0711 039 666</p>
					<p class="text-sm text-gray-600 mt-2">Luni - Vineri: 09:00 - 18:00</p>
				</a>

				<a
					href="mailto:office@psimed.ro"
					class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
				>
					<Icon name="email" size="32" class="mx-auto mb-3 text-primary" />
					<h3 class="font-bold mb-2">Email</h3>
					<p class="text-primary text-lg font-medium">office@psimed.ro</p>
					<p class="text-sm text-gray-600 mt-2">Răspundem în 24-48 ore</p>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Consultation Types -->
<section class="section-spacing bg-gray-50">
	<div class="container-custom">
		<h2 class="text-3xl font-bold text-center mb-12">Tipuri de consultații</h2>
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each consultationTypes as type}
				<div class="bg-white rounded-xl p-6">
					<Icon name={type.icon} size="40" class="text-primary mb-4" />
					<h3 class="text-lg font-bold mb-2">{type.title}</h3>
					<p class="text-sm text-primary font-medium mb-3">{type.duration}</p>
					<p class="text-sm text-gray-600">{type.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Our Specialists -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<h2 class="text-3xl font-bold text-center mb-12">Specialiștii noștri</h2>
		<div class="grid md:grid-cols-2 gap-8">
			{#each specialists as specialist}
				<div class="bg-gray-50 rounded-xl p-6">
					<div class="flex items-start space-x-4">
						<div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex-shrink-0"></div>
						<div class="flex-1">
							<h3 class="text-xl font-bold mb-1">{specialist.name}</h3>
							<p class="text-primary text-sm font-medium mb-3">{specialist.role}</p>
							<div class="mb-3">
								<p class="text-sm font-semibold text-gray-700 mb-1">Specializări:</p>
								<div class="flex flex-wrap gap-2">
									{#each specialist.specialties as specialty}
										<span class="text-xs bg-white px-2 py-1 rounded">{specialty}</span>
									{/each}
								</div>
							</div>
							<p class="text-sm text-gray-600">
								<strong>Disponibil:</strong>
								{specialist.available}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- What to Expect -->
<section class="section-spacing bg-primary text-white">
	<div class="container-custom max-w-4xl">
		<h2 class="text-3xl font-bold text-center mb-12">Ce să te aștepți la prima consultație?</h2>
		<div class="grid md:grid-cols-3 gap-8">
			<div class="text-center">
				<div class="inline-block p-4 bg-white/10 rounded-full mb-4">
					<Icon name="user" size="32" />
				</div>
				<h3 class="text-lg font-bold mb-2">Evaluare completă</h3>
				<p class="text-sm opacity-90">
					Discutăm despre istoricul medical, simptomele actuale și obiectivele tale
				</p>
			</div>
			<div class="text-center">
				<div class="inline-block p-4 bg-white/10 rounded-full mb-4">
					<Icon name="brain" size="32" />
				</div>
				<h3 class="text-lg font-bold mb-2">Plan personalizat</h3>
				<p class="text-sm opacity-90">
					Stabilim împreună cel mai bun plan de tratament pentru nevoile tale
				</p>
			</div>
			<div class="text-center">
				<div class="inline-block p-4 bg-white/10 rounded-full mb-4">
					<Icon name="calendar" size="32" />
				</div>
				<h3 class="text-lg font-bold mb-2">Urmărire continuă</h3>
				<p class="text-sm opacity-90">
					Programăm consultații de follow-up pentru a monitoriza progresul
				</p>
			</div>
		</div>
	</div>
</section>

<!-- FAQ -->
<section class="section-spacing bg-white">
	<div class="container-custom max-w-3xl">
		<h2 class="text-3xl font-bold text-center mb-12">Întrebări frecvente despre programare</h2>
		<div class="space-y-6">
			{#each [ { q: 'Pot anula sau reprograma o consultație?', a: 'Da, poți anula sau reprograma consultația cu minimum 24 de ore înainte. Te rugăm să ne anunți telefonic sau prin email.' }, { q: 'Cât timp durează până primesc confirmarea?', a: 'Vei primi o confirmare automată prin email imediat după programare, și o confirmare telefonică în 24 de ore.' }, { q: 'Pot veni însoțit de o altă persoană?', a: 'Da, poți veni însoțit. Pentru consultații pediatrice, prezența părinților este necesară.' }, { q: 'Ce documente trebuie să aduc?', a: 'Pentru prima consultație, te rugăm să aduci actul de identitate, card de sănătate (dacă ai), și orice analize/investigații medicale relevante.' } ] as faq}
				<div class="border-b border-gray-200 pb-6">
					<h3 class="text-lg font-bold mb-2">{faq.q}</h3>
					<p class="text-gray-600">{faq.a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
