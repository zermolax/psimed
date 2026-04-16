<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
		gdprConsent: false
	});

	let formStatus = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		formStatus = 'submitting';

		// Simulare submit (în realitate ar fi un API call)
		try {
			// Aici ar fi logica de trimitere email sau salvare în DB
			await new Promise((resolve) => setTimeout(resolve, 1500));

			formStatus = 'success';
			// Reset form
			formData = {
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: '',
				gdprConsent: false
			};

			// Reset success message după 5 secunde
			setTimeout(() => {
				formStatus = 'idle';
			}, 5000);
		} catch (error) {
			formStatus = 'error';
			errorMessage = 'A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi telefonic.';
		}
	}
</script>

<svelte:head>
	<title>Contact - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Contactează Clinica Sf. Gherasim din Bacău. Telefon: 0711 039 666. Programări, informații și întrebări despre serviciile noastre."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Contactează-ne</h1>
			<p class="text-xl text-gray-700 leading-relaxed">
				Suntem aici pentru a răspunde întrebărilor tale și pentru a te ajuta să găsești cele mai
				bune soluții pentru sănătatea ta mentală.
			</p>
		</div>
	</div>
</section>

<!-- Contact Info & Form -->
<section class="section-spacing bg-white">
	<div class="container-custom">
		<div class="grid lg:grid-cols-2 gap-12">
			<!-- Contact Information -->
			<div>
				<h2 class="text-3xl font-bold mb-8 text-gray-900">Informații de Contact</h2>

				<!-- Contact Cards -->
				<div class="space-y-6 mb-8">
					<a
						href="tel:+40711039666"
						class="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-2 border-gray-200"
					>
						<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
							<Icon name="phone" size="24" class="text-white" />
						</div>
						<div>
							<h3 class="font-bold mb-1 text-gray-900">Telefon</h3>
							<p class="text-lg text-gray-900 font-bold">+40 711 039 666</p>
							<p class="text-sm text-gray-700 mt-1">Luni - Vineri: 09:00 - 18:00</p>
						</div>
					</a>

					<a
						href="mailto:office@clinicasfgherasim.ro"
						class="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-2 border-gray-200"
					>
						<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
							<Icon name="email" size="24" class="text-white" />
						</div>
						<div>
							<h3 class="font-bold mb-1 text-gray-900">Email</h3>
							<p class="text-lg text-gray-900 font-bold">office@clinicasfgherasim.ro</p>
							<p class="text-sm text-gray-700 mt-1">Răspundem în 24-48 ore</p>
						</div>
					</a>

					<div class="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
						<div class="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
							<Icon name="calendar" size="24" class="text-white" />
						</div>
						<div>
							<h3 class="font-bold mb-1 text-gray-900">Program</h3>
							<div class="space-y-1 text-gray-700">
								<p>Luni - Vineri: 09:00 - 18:00</p>
								<p>Sâmbătă: pe bază de programare</p>
								<p>Duminică: Închis</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Links -->
				<div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
					<h3 class="font-bold mb-4 text-gray-900">Programare rapidă</h3>
					<p class="text-gray-800 mb-4">
						Pentru o programare rapidă, folosește sistemul nostru online de rezervări.
					</p>
					<Button href="/programare" variant="primary" size="md" class="w-full">
						Programează-te Online
					</Button>
				</div>
			</div>

			<!-- Contact Form -->
			<div>
				<h2 class="text-3xl font-bold mb-8 text-gray-900">Trimite-ne un mesaj</h2>

				{#if formStatus === 'success'}
					<div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
						<div class="flex items-start space-x-3">
							<Icon name="check" size="24" class="text-green-600" />
							<div>
								<h3 class="font-bold text-green-900 mb-1">Mesaj trimis cu succes!</h3>
								<p class="text-green-800">
									Mulțumim pentru mesaj. Vom reveni cu un răspuns în cel mai scurt timp posibil.
								</p>
							</div>
						</div>
					</div>
				{/if}

				{#if formStatus === 'error'}
					<div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
						<div class="flex items-start space-x-3">
							<Icon name="close" size="24" class="text-red-600" />
							<div>
								<h3 class="font-bold text-red-900 mb-1">Eroare</h3>
								<p class="text-red-800">{errorMessage}</p>
							</div>
						</div>
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-6">
					<Input
						type="text"
						name="name"
						label="Nume complet"
						placeholder="Ion Popescu"
						bind:value={formData.name}
						required
					/>

					<div class="grid md:grid-cols-2 gap-6">
						<Input
							type="email"
							name="email"
							label="Email"
							placeholder="ion@example.com"
							bind:value={formData.email}
							required
						/>

						<Input
							type="tel"
							name="phone"
							label="Telefon"
							placeholder="0711 123 456"
							bind:value={formData.phone}
							required
						/>
					</div>

					<Input
						type="text"
						name="subject"
						label="Subiect"
						placeholder="Programare consultație"
						bind:value={formData.subject}
						required
					/>

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
							Mesaj <span class="text-red-500">*</span>
						</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							bind:value={formData.message}
							required
							placeholder="Scrie mesajul tău aici..."
							class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						></textarea>
					</div>

					<div class="flex items-start space-x-3">
						<input
							type="checkbox"
							id="gdpr"
							bind:checked={formData.gdprConsent}
							required
							class="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
						/>
						<label for="gdpr" class="text-sm text-gray-600">
							Sunt de acord cu prelucrarea datelor personale conform
							<a href="/politica-confidentialitate" class="text-primary hover:underline"
								>Politicii de Confidențialitate</a
							>. <span class="text-red-500">*</span>
						</label>
					</div>

					<Button
						type="submit"
						variant="primary"
						size="lg"
						class="w-full"
						disabled={formStatus === 'submitting'}
					>
						{formStatus === 'submitting' ? 'Se trimite...' : 'Trimite mesajul'}
					</Button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- Map Section -->
<section class="bg-gray-50 py-12">
	<div class="container-custom">
		<h2 class="text-3xl font-bold text-center mb-8 text-gray-900">Locația noastră</h2>
		<div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
			<div class="aspect-video w-full">
				<iframe
					title="Locație Clinica Sf. Gherasim — Str. Bogdan Voievod 18, Bacău"
					src="https://www.openstreetmap.org/export/embed.html?bbox=26.8884%2C46.5593%2C26.9084%2C46.5693&layer=mapnik&marker=46.5643022%2C26.8983681"
					style="width:100%;height:100%;border:0;"
					allowfullscreen
					loading="lazy"
				></iframe>
			</div>
			<div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<p class="text-gray-700 text-sm">
					<strong class="text-gray-900">Str. Bogdan Voievod nr. 18, Bacău</strong>
				</p>
				<a
					href="https://www.openstreetmap.org/?mlat=46.5643022&mlon=26.8983681#map=17/46.5643022/26.8983681"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[#dd4444] font-medium hover:underline whitespace-nowrap"
				>
					Deschide harta →
				</a>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="section-spacing bg-white">
	<div class="container-custom max-w-3xl">
		<h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Întrebări frecvente</h2>
		<div class="space-y-6">
			{#each [ { q: 'Cum pot face o programare?', a: 'Poți face o programare online prin sistemul nostru de rezervări, telefonic la +40 711 039 666, sau prin email la office@clinicasfgherasim.ro.' }, { q: 'Acceptați card de sănătate?', a: 'Da, acceptăm card de sănătate pentru consultațiile acoperite de Casa de Asigurări de Sănătate. Unele servicii specializate se decontează separat.' }, { q: 'Cât durează o consultație?', a: 'O consultație inițială durează aproximativ 60 de minute, iar consultațiile de follow-up durează 30-45 de minute.' }, { q: 'Este nevoie de recomandare de la medicul de familie?', a: 'Pentru consultații private nu este nevoie de recomandare. Pentru decontare prin CNAS, este necesară trimitere de la medicul de familie.' } ] as faq}
				<div class="border-b border-gray-200 pb-6">
					<h3 class="text-lg font-bold mb-2 text-gray-900">{faq.q}</h3>
					<p class="text-gray-700">{faq.a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
