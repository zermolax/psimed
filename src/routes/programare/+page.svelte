<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	// Types for MedSoft data
	interface Doctor {
		cod: number;
		cod_punct_lucru: number;
		nume: string;
		prenume: string;
		specialitate: string;
		interval_programare: number;
		telefon?: string;
		email?: string;
	}

	interface Service {
		cod: number;
		denumire: string;
		punct_lucru: number;
		pret: number;
		valuta: string;
		tip_serviciu: string;
	}

	// Form state
	let currentStep = $state(1);
	let isLoading = $state(false);
	let error = $state('');
	let successMessage = $state('');

	// Data from MedSoft
	let doctors = $state<Doctor[]>([]);
	let services = $state<Service[]>([]);

	// Form values
	let selectedDoctor = $state<Doctor | null>(null);
	let selectedService = $state<Service | null>(null);
	let patientData = $state({
		nume: '',
		prenume: '',
		telefon: '',
		email: '',
		mesaj: ''
	});

	// Load doctors on mount
	$effect(() => {
		loadDoctors();
		loadServices();
	});

	async function loadDoctors() {
		try {
			isLoading = true;
			const response = await fetch('/api/medsoft/doctors');
			const data = await response.json();

			if (data.success) {
				doctors = data.data;
			} else {
				error = data.error || 'Nu s-au putut încărca medicii.';
			}
		} catch (e) {
			error = 'Eroare la conectarea cu serverul.';
		} finally {
			isLoading = false;
		}
	}

	async function loadServices() {
		try {
			const response = await fetch('/api/medsoft/services');
			const data = await response.json();

			if (data.success) {
				services = data.data;
			}
		} catch (e) {
			console.error('Error loading services:', e);
		}
	}

	function selectDoctor(doctor: Doctor) {
		selectedDoctor = doctor;
		currentStep = 2;
	}

	function selectService(service: Service) {
		selectedService = service;
		currentStep = 3;
	}

	async function submitBookingRequest() {
		if (!selectedDoctor || !patientData.nume || !patientData.prenume || !patientData.telefon) {
			error = 'Vă rugăm completați toate câmpurile obligatorii.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Register patient in MedSoft
			const patientResponse = await fetch('/api/medsoft/patient', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nume: patientData.nume,
					prenume: patientData.prenume,
					telefon: patientData.telefon,
					email: patientData.email
				})
			});

			const patientResult = await patientResponse.json();

			if (!patientResult.success) {
				throw new Error(patientResult.error);
			}

			// Show success - the clinic will contact for scheduling
			successMessage = `Mulțumim, ${patientData.prenume}! Datele dumneavoastră au fost înregistrate. Clinica vă va contacta în curând pentru a stabili data și ora programării.`;
			currentStep = 4;
		} catch (e) {
			error = e instanceof Error ? e.message : 'A apărut o eroare. Vă rugăm încercați din nou.';
		} finally {
			isLoading = false;
		}
	}

	function goBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function resetForm() {
		currentStep = 1;
		selectedDoctor = null;
		selectedService = null;
		patientData = { nume: '', prenume: '', telefon: '', email: '', mesaj: '' };
		successMessage = '';
		error = '';
	}
</script>

<svelte:head>
	<title>Programare Online - Clinica Sf. Gherasim</title>
	<meta name="description" content="Programează-te online la Clinica Sf. Gherasim din Bacău. Psihiatrie și Psihologie pentru adulți și copii." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-16 md:py-20">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

	<div class="container-custom relative z-10">
		<div class="text-center max-w-3xl mx-auto">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-gray-900 mb-6">
				Programare
				<span class="text-primary">Online</span>
			</h1>
			<p class="text-xl text-gray-700">
				Completați formularul de mai jos și vă vom contacta pentru a stabili programarea.
			</p>
		</div>
	</div>
</section>

<!-- Booking Form Section -->
<section class="py-16 bg-gray-50">
	<div class="container-custom">
		<!-- Progress Steps -->
		<div class="max-w-3xl mx-auto mb-12">
			<div class="flex items-center justify-between">
				{#each [{ num: 1, label: 'Medic' }, { num: 2, label: 'Serviciu' }, { num: 3, label: 'Date personale' }] as step}
					<div class="flex items-center {step.num < 3 ? 'flex-1' : ''}">
						<div class="flex flex-col items-center">
							<div
								class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
								{currentStep >= step.num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}"
							>
								{#if currentStep > step.num}
									✓
								{:else}
									{step.num}
								{/if}
							</div>
							<span class="mt-2 text-sm font-medium {currentStep >= step.num ? 'text-primary' : 'text-gray-400'}">
								{step.label}
							</span>
						</div>
						{#if step.num < 3}
							<div class="flex-1 h-1 mx-4 rounded {currentStep > step.num ? 'bg-primary' : 'bg-gray-200'}"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Error Message -->
		{#if error}
			<div class="max-w-3xl mx-auto mb-8">
				<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
					<p class="text-red-700">{error}</p>
				</div>
			</div>
		{/if}

		<!-- Loading State -->
		{#if isLoading && currentStep < 4}
			<div class="max-w-3xl mx-auto text-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
				<p class="mt-4 text-gray-600">Se încarcă...</p>
			</div>
		{:else}
			<!-- Step 1: Select Doctor -->
			{#if currentStep === 1}
				<div class="max-w-4xl mx-auto">
					<h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Alegeți medicul</h2>

					{#if doctors.length === 0}
						<div class="text-center py-12 bg-white rounded-2xl shadow-lg">
							<p class="text-gray-600">Nu sunt medici disponibili momentan.</p>
							<p class="text-gray-500 mt-2">Vă rugăm să ne contactați telefonic.</p>
						</div>
					{:else}
						<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each doctors as doctor}
								<button
									type="button"
									class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-primary group"
									onclick={() => selectDoctor(doctor)}
								>
									<div class="flex items-center gap-4 mb-4">
										<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
											<span class="text-2xl text-primary font-bold">
												{doctor.prenume[0]}{doctor.nume[0]}
											</span>
										</div>
										<div>
											<h3 class="font-bold text-gray-900 group-hover:text-primary transition-colors">
												Dr. {doctor.prenume} {doctor.nume}
											</h3>
											<p class="text-sm text-gray-600">{doctor.specialitate}</p>
										</div>
									</div>
									{#if doctor.interval_programare}
										<p class="text-sm text-gray-500">
											Consultație: {doctor.interval_programare} minute
										</p>
									{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 2: Select Service -->
			{#if currentStep === 2}
				<div class="max-w-4xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi la medici
					</button>

					<h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Alegeți serviciul</h2>
					<p class="text-center text-gray-600 mb-8">
						Pentru: <strong>Dr. {selectedDoctor?.prenume} {selectedDoctor?.nume}</strong>
					</p>

					{#if services.length === 0}
						<div class="text-center py-12 bg-white rounded-2xl shadow-lg">
							<p class="text-gray-600 mb-4">Nu sunt servicii configurate.</p>
							<Button onclick={() => { currentStep = 3; }}>
								Continuă fără serviciu specific
							</Button>
						</div>
					{:else}
						<div class="grid md:grid-cols-2 gap-6">
							{#each services as service}
								<button
									type="button"
									class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-primary group"
									onclick={() => selectService(service)}
								>
									<h3 class="font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
										{service.denumire}
									</h3>
									<div class="flex justify-between items-center">
										<span class="text-sm text-gray-500">{service.tip_serviciu}</span>
										<span class="font-bold text-primary">{service.pret} {service.valuta}</span>
									</div>
								</button>
							{/each}
						</div>

						<div class="text-center mt-8">
							<button
								type="button"
								class="text-gray-600 hover:text-primary underline"
								onclick={() => { selectedService = null; currentStep = 3; }}
							>
								Continuă fără a selecta un serviciu specific
							</button>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 3: Patient Information -->
			{#if currentStep === 3}
				<div class="max-w-2xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>

					<div class="bg-white rounded-2xl p-8 shadow-lg">
						<h2 class="text-2xl font-bold text-gray-900 mb-2 text-center">Datele dumneavoastră</h2>
						<p class="text-center text-gray-600 mb-8">
							Completați informațiile pentru a finaliza cererea de programare.
						</p>

						<!-- Selected Summary -->
						<div class="bg-gray-50 rounded-xl p-4 mb-8">
							<p class="text-sm text-gray-600">
								<strong>Medic:</strong> Dr. {selectedDoctor?.prenume} {selectedDoctor?.nume}
							</p>
							{#if selectedService}
								<p class="text-sm text-gray-600 mt-1">
									<strong>Serviciu:</strong> {selectedService.denumire} ({selectedService.pret} {selectedService.valuta})
								</p>
							{/if}
						</div>

						<form onsubmit={(e) => { e.preventDefault(); submitBookingRequest(); }} class="space-y-6">
							<div class="grid md:grid-cols-2 gap-6">
								<div>
									<label for="nume" class="block text-sm font-medium text-gray-700 mb-2">
										Nume <span class="text-red-500">*</span>
									</label>
									<input
										id="nume"
										type="text"
										bind:value={patientData.nume}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="Popescu"
									/>
								</div>
								<div>
									<label for="prenume" class="block text-sm font-medium text-gray-700 mb-2">
										Prenume <span class="text-red-500">*</span>
									</label>
									<input
										id="prenume"
										type="text"
										bind:value={patientData.prenume}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="Ion"
									/>
								</div>
							</div>

							<div class="grid md:grid-cols-2 gap-6">
								<div>
									<label for="telefon" class="block text-sm font-medium text-gray-700 mb-2">
										Telefon <span class="text-red-500">*</span>
									</label>
									<input
										id="telefon"
										type="tel"
										bind:value={patientData.telefon}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="0740 123 456"
									/>
								</div>
								<div>
									<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<input
										id="email"
										type="email"
										bind:value={patientData.email}
										class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
										placeholder="ion@email.com"
									/>
								</div>
							</div>

							<div>
								<label for="mesaj" class="block text-sm font-medium text-gray-700 mb-2">
									Mesaj sau observații
								</label>
								<textarea
									id="mesaj"
									bind:value={patientData.mesaj}
									rows={4}
									class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
									placeholder="Descrieți pe scurt motivul consultației..."
								></textarea>
							</div>

							<div class="pt-4">
								<Button type="submit" size="lg" disabled={isLoading}>
									{#if isLoading}
										Se trimite...
									{:else}
										Trimite cererea de programare
									{/if}
								</Button>
							</div>

							<p class="text-sm text-gray-500 text-center">
								După trimitere, vă vom contacta pentru a stabili data și ora exactă a programării.
							</p>
						</form>
					</div>
				</div>
			{/if}

			<!-- Step 4: Success -->
			{#if currentStep === 4}
				<div class="max-w-2xl mx-auto text-center">
					<div class="bg-white rounded-2xl p-12 shadow-lg">
						<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<span class="text-4xl">✓</span>
						</div>

						<h2 class="text-2xl font-bold text-gray-900 mb-4">Cerere trimisă cu succes!</h2>
						<p class="text-gray-600 mb-8">{successMessage}</p>

						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<Button href="/">Înapoi la pagina principală</Button>
							<Button variant="secondary" onclick={resetForm}>Programare nouă</Button>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>

<!-- Contact Info -->
<section class="py-12 bg-white">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Preferați să sunați?</h2>
			<p class="text-gray-600 mb-6">
				Ne puteți contacta direct la numărul nostru de telefon pentru programări.
			</p>
			<a
				href="tel:+40234123456"
				class="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-colors"
			>
				📞 +40 234 123 456
			</a>
		</div>
	</div>
</section>
