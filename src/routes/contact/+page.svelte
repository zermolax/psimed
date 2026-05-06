<script lang="ts">
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

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			const result = await res.json();

			if (result.success) {
				formStatus = 'success';
				formData = {
					name: '',
					email: '',
					phone: '',
					subject: '',
					message: '',
					gdprConsent: false
				};
				setTimeout(() => {
					formStatus = 'idle';
				}, 5000);
			} else {
				formStatus = 'error';
				errorMessage =
					result.error ||
					'A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi telefonic.';
			}
		} catch {
			formStatus = 'error';
			errorMessage = 'A apărut o eroare de rețea. Te rugăm să încerci din nou.';
		}
	}
</script>

<svelte:head>
	<title>Contact - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Contactează Clinica Sf. Gherasim din Bacău. Telefon: 0376 501 501. Programări, informații și întrebări despre serviciile noastre."
	/>
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f9fa]">
	<!-- HERO -->
	<section class="bg-[#f8f9fa] py-20 md:py-24">
		<div class="container-custom">
			<div class="max-w-3xl">
				<div class="flex items-center gap-2.5 mb-5">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Contact
					</span>
				</div>
				<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6">
					Contactează-<span class="text-[#c13333]">ne</span>
				</h1>
				<p class="text-lg text-gray-700 leading-[1.65] max-w-2xl">
					Suntem aici pentru a răspunde întrebărilor tale și pentru a te ajuta să găsești cele mai
					bune soluții pentru sănătatea ta mentală.
				</p>
			</div>
		</div>
	</section>

	<!-- INFO + FORM -->
	<section class="bg-white py-20 md:py-24 border-y border-gray-200">
		<div class="container-custom">
			<div class="grid lg:grid-cols-2 gap-12">
				<!-- Contact Info -->
				<div>
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#155e75]"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
							Informații de Contact
						</span>
					</div>
					<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
						Cum ne <span class="text-[#c13333]">găsești</span>
					</h2>

					<div class="space-y-4 mb-8">
						<a
							href="tel:+40376501501"
							class="flex items-start gap-4 p-5 bg-[#f8f9fa] rounded border border-gray-200 hover:shadow-md transition-shadow"
						>
							<div
								class="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center text-white"
								style="background: #c13333;"
							>
								<Icon name="phone" size="22" />
							</div>
							<div>
								<h3 class="font-bold mb-1 text-gray-900 text-base">Telefon</h3>
								<p class="text-lg text-gray-900 font-bold">+40 376 501 501</p>
								<p class="text-sm text-gray-600 mt-1">Luni - Vineri: 09:00 - 18:00</p>
							</div>
						</a>

						<a
							href="mailto:office@clinicasfgherasim.ro"
							class="flex items-start gap-4 p-5 bg-[#f8f9fa] rounded border border-gray-200 hover:shadow-md transition-shadow"
						>
							<div
								class="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center text-white"
								style="background: #155e75;"
							>
								<Icon name="email" size="22" />
							</div>
							<div>
								<h3 class="font-bold mb-1 text-gray-900 text-base">Email</h3>
								<p class="text-lg text-gray-900 font-bold break-all">office@clinicasfgherasim.ro</p>
								<p class="text-sm text-gray-600 mt-1">Răspundem în 24-48 ore</p>
							</div>
						</a>

						<div class="flex items-start gap-4 p-5 bg-[#f8f9fa] rounded border border-gray-200">
							<div
								class="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center text-white bg-gray-900"
							>
								<Icon name="calendar" size="22" />
							</div>
							<div>
								<h3 class="font-bold mb-1 text-gray-900 text-base">Program</h3>
								<div class="space-y-1 text-base text-gray-700">
									<p>Luni - Vineri: 09:00 - 18:00</p>
									<p>Sâmbătă: pe bază de programare</p>
									<p>Duminică: Închis</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Quick Booking -->
					<div
						class="rounded p-6"
						style="background: #cffafe; border: 1px solid #155e7540;"
					>
						<h3 class="font-extrabold text-lg mb-2 text-gray-900">Programare rapidă</h3>
						<p class="text-base text-gray-700 mb-4 leading-[1.65]">
							Pentru o programare rapidă, folosește sistemul nostru online de rezervări.
						</p>
						<a
							href="/programare"
							class="inline-flex items-center justify-center gap-2 w-full bg-[#c13333] hover:bg-[#a52828] text-white font-bold text-base px-6 py-3 rounded transition-colors"
						>
							<Icon name="calendar" size="16" />
							Programează-te Online
						</a>
					</div>
				</div>

				<!-- Form -->
				<div>
					<div class="flex items-center gap-2.5 mb-3">
						<span class="w-7 h-px bg-[#c13333]"></span>
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#c13333]">
							Formular
						</span>
					</div>
					<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
						Trimite-ne un <span class="text-[#c13333]">mesaj</span>
					</h2>

					{#if formStatus === 'success'}
						<div class="bg-green-50 border border-green-200 rounded p-5 mb-6">
							<div class="flex items-start gap-3">
								<Icon name="check" size="24" class="text-green-600" />
								<div>
									<h3 class="font-bold text-green-900 mb-1">Mesaj trimis cu succes!</h3>
									<p class="text-base text-green-800">
										Mulțumim pentru mesaj. Vom reveni cu un răspuns în cel mai scurt timp posibil.
									</p>
								</div>
							</div>
						</div>
					{/if}

					{#if formStatus === 'error'}
						<div class="bg-red-50 border border-red-200 rounded p-5 mb-6">
							<div class="flex items-start gap-3">
								<Icon name="close" size="24" class="text-red-600" />
								<div>
									<h3 class="font-bold text-red-900 mb-1">Eroare</h3>
									<p class="text-base text-red-800">{errorMessage}</p>
								</div>
							</div>
						</div>
					{/if}

					<form onsubmit={handleSubmit} class="space-y-5">
						<Input
							type="text"
							name="name"
							label="Nume complet"
							placeholder="Ion Popescu"
							bind:value={formData.name}
							required
						/>

						<div class="grid md:grid-cols-2 gap-5">
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
							<label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
								Mesaj <span class="text-[#c13333]">*</span>
							</label>
							<textarea
								id="message"
								name="message"
								rows="5"
								bind:value={formData.message}
								required
								placeholder="Scrie mesajul tău aici..."
								class="w-full px-4 py-3 border border-gray-300 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
								style="--tw-ring-color: #c13333;"
							></textarea>
						</div>

						<div class="flex items-start gap-3">
							<input
								type="checkbox"
								id="gdpr"
								bind:checked={formData.gdprConsent}
								required
								class="mt-1 w-4 h-4 border-gray-300 rounded"
								style="accent-color: #c13333;"
							/>
							<label for="gdpr" class="text-sm text-gray-700 leading-[1.5]">
								Sunt de acord cu prelucrarea datelor personale conform
								<a
									href="/politica-confidentialitate"
									class="font-semibold hover:underline"
									style="color: #c13333;"
								>
									Politicii de Confidențialitate</a
								>. <span class="text-[#c13333]">*</span>
							</label>
						</div>

						<button
							type="submit"
							class="w-full inline-flex items-center justify-center gap-2 bg-[#c13333] hover:bg-[#a52828] text-white font-bold text-base px-6 py-3.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={formStatus === 'submitting'}
						>
							{formStatus === 'submitting' ? 'Se trimite...' : 'Trimite mesajul'}
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>

	<!-- MAP -->
	<section class="bg-[#f8f9fa] py-16">
		<div class="container-custom">
			<div class="max-w-5xl mx-auto">
				<div class="flex items-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Locația Noastră
					</span>
				</div>
				<h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
					Ne găsești în <span class="text-[#c13333]">Bacău</span>
				</h2>

				<div class="bg-white border border-gray-200 rounded overflow-hidden">
					<div class="aspect-video w-full">
						<iframe
							title="Locație Clinica Sf. Gherasim — Str. Bogdan Voievod 18, Bacău"
							src="https://www.openstreetmap.org/export/embed.html?bbox=26.8884%2C46.5593%2C26.9084%2C46.5693&layer=mapnik&marker=46.5643022%2C26.8983681"
							style="width:100%;height:100%;border:0;"
							allowfullscreen
							loading="lazy"
						></iframe>
					</div>
					<div
						class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
					>
						<p class="text-base text-gray-700">
							<strong class="text-gray-900">Str. Bogdan Voievod nr. 18, Bacău</strong>
						</p>
						<a
							href="https://www.openstreetmap.org/?mlat=46.5643022&mlon=26.8983681#map=17/46.5643022/26.8983681"
							target="_blank"
							rel="noopener noreferrer"
							class="text-base font-semibold hover:underline whitespace-nowrap"
							style="color: #c13333;"
						>
							Deschide harta →
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="bg-white py-20 md:py-24 border-t border-gray-200">
		<div class="container-custom max-w-3xl">
			<div class="text-center mb-12">
				<div class="flex items-center justify-center gap-2.5 mb-3">
					<span class="w-7 h-px bg-[#155e75]"></span>
					<span class="text-xs font-bold uppercase tracking-[0.18em] text-[#155e75]">
						Întrebări Frecvente
					</span>
					<span class="w-7 h-px bg-[#155e75]"></span>
				</div>
				<h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
					Răspunsuri la <span class="text-[#c13333]">întrebări comune</span>
				</h2>
			</div>
			<div class="space-y-6">
				{#each [{ q: 'Cum pot face o programare?', a: 'Poți face o programare online prin sistemul nostru de rezervări, telefonic la +40 376 501 501, sau prin email la office@clinicasfgherasim.ro.' }, { q: 'Acceptați card de sănătate?', a: 'Da, acceptăm card de sănătate pentru consultațiile acoperite de Casa de Asigurări de Sănătate. Unele servicii specializate se decontează separat.' }, { q: 'Cât durează o consultație?', a: 'O consultație inițială durează aproximativ 60 de minute, iar consultațiile de follow-up durează 30-45 de minute.' }, { q: 'Este nevoie de recomandare de la medicul de familie?', a: 'Pentru consultații private nu este nevoie de recomandare. Pentru decontare prin CNAS, este necesară trimitere de la medicul de familie.' }] as faq}
					<div class="border-b border-gray-200 pb-6">
						<h3 class="text-lg md:text-xl font-extrabold mb-2 text-gray-900">{faq.q}</h3>
						<p class="text-base text-gray-700 leading-[1.65]">{faq.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
