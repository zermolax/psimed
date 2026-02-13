<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Calendar from '$lib/components/molecules/Calendar.svelte';

	// Types
	interface ClinicLocation {
		LocationId: number;
		LocationName: string;
		LocationAddress?: string;
	}

	interface Specialty {
		LocationId: number;
		SpecialtyId: number;
		Name: string;
	}

	interface Doctor {
		LocationId: number;
		DoctorId: number;
		Name: string;
		Grade?: string;
		SpecialtyId: number;
		SpecialtyName: string;
		SlotDuration: number;
	}

	interface AppointmentScop {
		cod: number;
		scop: string;
		durata: number;
		medic?: number;
		lista_servicii?: Array<{
			cod: number;
			pret: number;
			denumire: string;
		}>;
	}

	interface ScheduleSlot {
		DoctorId: number;
		StartDateTime: string;
		EndDateTime: string;
		IsAvailable: number;
		SpecialtyId: number;
		LocationId: number;
	}

	interface TimeSlot {
		start: Date;
		end: Date;
		formatted: string;
	}

	// Steps
	const STEPS = {
		LOCATION: 1,
		SPECIALTY: 2,
		DOCTOR: 3,
		SERVICE: 4,
		DATETIME: 5,
		PATIENT: 6,
		CONFIRMATION: 7
	};

	// State
	let currentStep = $state(STEPS.LOCATION);
	let isLoading = $state(false);
	let error = $state('');

	// Data from API
	let locations = $state<ClinicLocation[]>([]);
	let specialties = $state<Specialty[]>([]);
	let doctors = $state<Doctor[]>([]);
	let scopes = $state<AppointmentScop[]>([]);
	let schedule = $state<ScheduleSlot[]>([]);

	// Selected values
	let selectedLocation = $state<ClinicLocation | null>(null);
	let selectedSpecialty = $state<Specialty | null>(null);
	let selectedDoctor = $state<Doctor | null>(null);
	let selectedScope = $state<AppointmentScop | null>(null);
	let selectedDate = $state<string>('');
	let selectedTimeSlot = $state<TimeSlot | null>(null);

	// Patient data
	let patientData = $state({
		nume: '',
		prenume: '',
		telefon: '',
		email: '',
		observatii: ''
	});

	// Appointment result
	let appointmentResult = $state<{ AppointmentId: number } | null>(null);

	// Computed: Available dates from schedule
	let availableDates = $derived.by(() => {
		if (!schedule.length || !selectedDoctor) return [];

		const doctorSchedule = schedule.filter((s) => s.DoctorId === selectedDoctor.DoctorId);
		const dates = new Set<string>();

		doctorSchedule.forEach((slot) => {
			const date = new Date(slot.StartDateTime).toISOString().split('T')[0];
			dates.add(date);
		});

		return Array.from(dates).sort();
	});

	// Computed: Time slots for selected date
	let availableTimeSlots = $derived.by(() => {
		if (!selectedDate || !schedule.length || !selectedDoctor || !selectedScope) return [];

		const duration = selectedScope.durata || selectedDoctor.SlotDuration;
		const doctorSchedule = schedule.filter((s) => s.DoctorId === selectedDoctor.DoctorId);

		const slots: TimeSlot[] = [];

		doctorSchedule.forEach((scheduleSlot) => {
			const slotDate = new Date(scheduleSlot.StartDateTime).toISOString().split('T')[0];
			if (slotDate !== selectedDate) return;

			const start = new Date(scheduleSlot.StartDateTime);
			const end = new Date(scheduleSlot.EndDateTime);

			let current = new Date(start);
			while (current.getTime() + duration * 60000 <= end.getTime()) {
				const slotEnd = new Date(current.getTime() + duration * 60000);
				slots.push({
					start: new Date(current),
					end: slotEnd,
					formatted: current.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
				});
				current = slotEnd;
			}
		});

		return slots;
	});

	// Load initial data
	$effect(() => {
		loadLocations();
	});

	// API Functions
	async function loadLocations() {
		isLoading = true;
		error = '';
		try {
			const res = await fetch('/api/medsoft/locations');
			const data = await res.json();
			if (data.success) {
				locations = data.data;
				// Auto-select if only one location
				if (locations.length === 1) {
					selectLocation(locations[0]);
				}
			} else {
				error = data.error;
			}
		} catch (e) {
			error = 'Eroare la încărcarea locațiilor';
		} finally {
			isLoading = false;
		}
	}

	async function loadSpecialties(locationId: number) {
		isLoading = true;
		error = '';
		try {
			const res = await fetch(`/api/medsoft/specialties?locationId=${locationId}`);
			const data = await res.json();
			if (data.success) {
				specialties = data.data;
			} else {
				error = data.error;
			}
		} catch (e) {
			error = 'Eroare la încărcarea specialităților';
		} finally {
			isLoading = false;
		}
	}

	async function loadDoctors(locationId: number, specialtyId: number) {
		isLoading = true;
		error = '';
		try {
			const res = await fetch(
				`/api/medsoft/doctors?locationId=${locationId}&specialtyId=${specialtyId}`
			);
			const data = await res.json();
			if (data.success) {
				doctors = data.data;
			} else {
				error = data.error;
			}
		} catch (e) {
			error = 'Eroare la încărcarea medicilor';
		} finally {
			isLoading = false;
		}
	}

	async function loadScopes(doctorId: number) {
		isLoading = true;
		error = '';
		try {
			const res = await fetch(`/api/medsoft/scopes?doctorId=${doctorId}`);
			const data = await res.json();
			if (data.success) {
				scopes = data.data;
			} else {
				error = data.error;
			}
		} catch (e) {
			error = 'Eroare la încărcarea serviciilor';
		} finally {
			isLoading = false;
		}
	}

	async function loadSchedule(doctorId: number) {
		isLoading = true;
		error = '';
		try {
			const today = new Date().toISOString().split('T')[0];
			const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

			const res = await fetch(
				`/api/medsoft/schedule?doctorId=${doctorId}&dateStart=${today}&dateEnd=${nextMonth}`
			);
			const data = await res.json();
			if (data.success) {
				schedule = data.data;
			} else {
				error = data.error;
			}
		} catch (e) {
			error = 'Eroare la încărcarea programului';
		} finally {
			isLoading = false;
		}
	}

	// Selection handlers
	function selectLocation(location: ClinicLocation) {
		selectedLocation = location;
		loadSpecialties(location.LocationId);
		currentStep = STEPS.SPECIALTY;
	}

	function selectSpecialty(specialty: Specialty) {
		selectedSpecialty = specialty;
		loadDoctors(selectedLocation!.LocationId, specialty.SpecialtyId);
		currentStep = STEPS.DOCTOR;
	}

	function selectDoctor(doctor: Doctor) {
		selectedDoctor = doctor;
		loadScopes(doctor.DoctorId);
		currentStep = STEPS.SERVICE;
	}

	function selectScope(scope: AppointmentScop) {
		selectedScope = scope;
		loadSchedule(selectedDoctor!.DoctorId);
		currentStep = STEPS.DATETIME;
	}

	function selectTimeSlot(slot: TimeSlot) {
		selectedTimeSlot = slot;
		currentStep = STEPS.PATIENT;
	}

	function goBack() {
		error = '';
		if (currentStep > STEPS.LOCATION) {
			currentStep--;
			// Reset dependent selections
			if (currentStep < STEPS.SPECIALTY) selectedSpecialty = null;
			if (currentStep < STEPS.DOCTOR) selectedDoctor = null;
			if (currentStep < STEPS.SERVICE) selectedScope = null;
			if (currentStep < STEPS.DATETIME) {
				selectedDate = '';
				selectedTimeSlot = null;
			}
		}
	}

	async function submitAppointment() {
		if (!selectedDoctor || !selectedLocation || !selectedTimeSlot) return;

		isLoading = true;
		error = '';

		try {
			const res = await fetch('/api/medsoft/appointment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					doctorId: selectedDoctor.DoctorId,
					locationId: selectedLocation.LocationId,
					startDateTime: selectedTimeSlot.start.toISOString().replace('.000Z', ''),
					endDateTime: selectedTimeSlot.end.toISOString().replace('.000Z', ''),
					patientName: `${patientData.nume} ${patientData.prenume}`.toUpperCase(),
					patientEmail: patientData.email || undefined,
					patientPhoneNumber: patientData.telefon,
					appointmentDetails: selectedScope?.scop || 'Consultație',
					appointmentNotes: patientData.observatii || undefined
				})
			});

			const data = await res.json();

			if (data.success) {
				appointmentResult = data.data;
				currentStep = STEPS.CONFIRMATION;
			} else {
				error = data.error || 'Eroare la crearea programării';
			}
		} catch (e) {
			error = 'Eroare la conectarea cu serverul';
		} finally {
			isLoading = false;
		}
	}

	function resetBooking() {
		currentStep = STEPS.LOCATION;
		selectedLocation = null;
		selectedSpecialty = null;
		selectedDoctor = null;
		selectedScope = null;
		selectedDate = '';
		selectedTimeSlot = null;
		patientData = { nume: '', prenume: '', telefon: '', email: '', observatii: '' };
		appointmentResult = null;
		error = '';
		loadLocations();
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('ro-RO', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getPrice(): number {
		if (!selectedScope?.lista_servicii?.length) return 0;
		return selectedScope.lista_servicii[0].pret;
	}
</script>

<svelte:head>
	<title>Programare Online - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Programează-te online la Clinica Sf. Gherasim din Bacău. Psihiatrie și Psihologie pentru adulți și copii."
	/>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-secondary-light py-12 md:py-16"
>
	<div
		class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
	></div>

	<div class="container-custom relative z-10">
		<div class="text-center max-w-3xl mx-auto">
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900 mb-4">
				Programare <span class="text-primary">Online</span>
			</h1>
			<p class="text-lg text-gray-700">
				Completați pașii de mai jos pentru a vă programa la clinica noastră.
			</p>
		</div>
	</div>
</section>

<!-- Progress Steps -->
{#if currentStep < STEPS.CONFIRMATION}
	<section class="py-6 bg-white border-b">
		<div class="container-custom">
			<div class="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2">
				{#each [{ n: 1, label: 'Locație' }, { n: 2, label: 'Specialitate' }, { n: 3, label: 'Medic' }, { n: 4, label: 'Serviciu' }, { n: 5, label: 'Data' }, { n: 6, label: 'Date' }] as step}
					<div class="flex items-center">
						<div
							class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              {currentStep >= step.n
								? 'bg-primary text-white'
								: 'bg-gray-200 text-gray-500'}"
						>
							{#if currentStep > step.n}
								✓
							{:else}
								{step.n}
							{/if}
						</div>
						<span
							class="ml-2 text-xs md:text-sm font-medium hidden sm:inline
              {currentStep >= step.n ? 'text-primary' : 'text-gray-400'}"
						>
							{step.label}
						</span>
						{#if step.n < 6}
							<div class="w-4 md:w-8 h-0.5 mx-2 {currentStep > step.n ? 'bg-primary' : 'bg-gray-200'}"
							></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Main Content -->
<section class="py-8 md:py-12 bg-gray-50 min-h-[60vh]">
	<div class="container-custom">
		<!-- Error Message -->
		{#if error}
			<div class="max-w-3xl mx-auto mb-6">
				<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
					<p class="text-red-700">{error}</p>
				</div>
			</div>
		{/if}

		<!-- Loading -->
		{#if isLoading}
			<div class="max-w-3xl mx-auto text-center py-12">
				<div
					class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
				></div>
				<p class="mt-4 text-gray-600">Se încarcă...</p>
			</div>
		{:else}
			<!-- Step 1: Location -->
			{#if currentStep === STEPS.LOCATION}
				<div class="max-w-4xl mx-auto">
					<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Selectați Locația</h2>
					<div class="grid md:grid-cols-2 gap-4">
						{#each locations as location}
							<button
								type="button"
								class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-primary group"
								onclick={() => selectLocation(location)}
							>
								<div class="flex items-start gap-4">
									<div
										class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"
									>
										<span class="text-xl">🏥</span>
									</div>
									<div>
										<h3
											class="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1"
										>
											{location.LocationName}
										</h3>
										{#if location.LocationAddress}
											<p class="text-sm text-gray-600">{location.LocationAddress}</p>
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Step 2: Specialty -->
			{#if currentStep === STEPS.SPECIALTY}
				<div class="max-w-4xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>
					<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Selectați Specialitatea</h2>
					<div class="grid md:grid-cols-2 gap-4">
						{#each specialties as specialty}
							<button
								type="button"
								class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-primary group"
								onclick={() => selectSpecialty(specialty)}
							>
								<h3 class="font-bold text-gray-900 group-hover:text-primary transition-colors">
									{specialty.Name}
								</h3>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Step 3: Doctor -->
			{#if currentStep === STEPS.DOCTOR}
				<div class="max-w-4xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>
					<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Selectați Medicul</h2>
					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each doctors as doctor}
							<button
								type="button"
								class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-primary group"
								onclick={() => selectDoctor(doctor)}
							>
								<div class="flex items-center gap-4 mb-3">
									<div
										class="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center"
									>
										<span class="text-xl text-primary font-bold">
											{doctor.Name.split(' ')
												.map((n) => n[0])
												.join('')
												.slice(0, 2)}
										</span>
									</div>
									<div>
										<h3
											class="font-bold text-gray-900 group-hover:text-primary transition-colors"
										>
											{doctor.Name}
										</h3>
										{#if doctor.Grade}
											<p class="text-sm text-gray-500">{doctor.Grade}</p>
										{/if}
									</div>
								</div>
								<p class="text-sm text-gray-600">{doctor.SpecialtyName}</p>
								<p class="text-xs text-gray-400 mt-1">
									Consultație: {doctor.SlotDuration} minute
								</p>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Step 4: Service/Scope -->
			{#if currentStep === STEPS.SERVICE}
				<div class="max-w-4xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>
					<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Selectați Serviciul</h2>
					<div class="grid md:grid-cols-2 gap-4">
						{#each scopes as scope}
							<button
								type="button"
								class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-primary group"
								onclick={() => selectScope(scope)}
							>
								<h3 class="font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
									{scope.scop}
								</h3>
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-500">{scope.durata} minute</span>
									{#if scope.lista_servicii?.length}
										<span class="font-bold text-primary">{scope.lista_servicii[0].pret} RON</span>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Step 5: Date & Time -->
			{#if currentStep === STEPS.DATETIME}
				<div class="max-w-4xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>
					<h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Selectați Data și Ora</h2>

					<!-- Selected info -->
					<div class="bg-white rounded-xl p-4 shadow-sm mb-6">
						<p class="text-sm text-gray-600">
							<strong>Medic:</strong>
							{selectedDoctor?.Name} |
							<strong>Serviciu:</strong>
							{selectedScope?.scop}
							{#if getPrice() > 0}
								| <strong>Preț:</strong> {getPrice()} RON
							{/if}
						</p>
					</div>

					{#if availableDates.length === 0}
						<div class="text-center py-8 bg-white rounded-xl">
							<p class="text-gray-600">Nu există date disponibile în următoarele 30 de zile.</p>
							<p class="text-sm text-gray-500 mt-2">Vă rugăm să ne contactați telefonic.</p>
						</div>
					{:else}
						<div class="grid md:grid-cols-2 gap-6">
							<!-- Date Selection with Calendar -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-3">Alegeți data:</label>
								<Calendar
									{availableDates}
									{selectedDate}
									onSelectDate={(date) => {
										selectedDate = date;
										selectedTimeSlot = null;
									}}
								/>
							</div>

							<!-- Time Selection -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-3">Alegeți ora:</label>
								{#if selectedDate && availableTimeSlots.length > 0}
									<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
										<p class="text-sm text-gray-600 mb-3">
											Ore disponibile pentru <strong>{formatDate(selectedDate)}</strong>:
										</p>
										<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
											{#each availableTimeSlots as slot}
												<button
													type="button"
													class="px-3 py-2 rounded-lg text-sm font-medium transition-all
														{selectedTimeSlot?.formatted === slot.formatted
															? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
															: 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary'}"
													onclick={() => selectTimeSlot(slot)}
												>
													{slot.formatted}
												</button>
											{/each}
										</div>
									</div>
								{:else if selectedDate}
									<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
										<p class="text-gray-500">Nu există ore disponibile pentru data selectată.</p>
									</div>
								{:else}
									<div class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
										<p class="text-gray-400">Selectați mai întâi o dată din calendar</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 6: Patient Data -->
			{#if currentStep === STEPS.PATIENT}
				<div class="max-w-2xl mx-auto">
					<button
						type="button"
						class="mb-6 text-primary hover:text-primary-dark font-medium flex items-center gap-2"
						onclick={goBack}
					>
						← Înapoi
					</button>

					<div class="bg-white rounded-xl p-6 md:p-8 shadow-lg">
						<h2 class="text-2xl font-bold text-gray-900 mb-2 text-center">Datele Dumneavoastră</h2>
						<p class="text-center text-gray-600 mb-6">
							Completați informațiile pentru a finaliza programarea.
						</p>

						<!-- Summary -->
						<div class="bg-gray-50 rounded-lg p-4 mb-6">
							<p class="text-sm"><strong>Medic:</strong> {selectedDoctor?.Name}</p>
							<p class="text-sm"><strong>Serviciu:</strong> {selectedScope?.scop}</p>
							<p class="text-sm">
								<strong>Data:</strong>
								{selectedDate ? formatDate(selectedDate) : ''} la {selectedTimeSlot?.formatted}
							</p>
							{#if getPrice() > 0}
								<p class="text-sm font-bold text-primary mt-2">Preț: {getPrice()} RON</p>
							{/if}
						</div>

						<form
							onsubmit={(e) => {
								e.preventDefault();
								submitAppointment();
							}}
							class="space-y-4"
						>
							<div class="grid md:grid-cols-2 gap-4">
								<div>
									<label for="nume" class="block text-sm font-medium text-gray-700 mb-1">
										Nume <span class="text-red-500">*</span>
									</label>
									<input
										id="nume"
										type="text"
										bind:value={patientData.nume}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
										placeholder="Popescu"
									/>
								</div>
								<div>
									<label for="prenume" class="block text-sm font-medium text-gray-700 mb-1">
										Prenume <span class="text-red-500">*</span>
									</label>
									<input
										id="prenume"
										type="text"
										bind:value={patientData.prenume}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
										placeholder="Ion"
									/>
								</div>
							</div>

							<div class="grid md:grid-cols-2 gap-4">
								<div>
									<label for="telefon" class="block text-sm font-medium text-gray-700 mb-1">
										Telefon <span class="text-red-500">*</span>
									</label>
									<input
										id="telefon"
										type="tel"
										bind:value={patientData.telefon}
										required
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
										placeholder="0740 123 456"
									/>
								</div>
								<div>
									<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<input
										id="email"
										type="email"
										bind:value={patientData.email}
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
										placeholder="ion@email.com"
									/>
								</div>
							</div>

							<div>
								<label for="observatii" class="block text-sm font-medium text-gray-700 mb-1">
									Observații
								</label>
								<textarea
									id="observatii"
									bind:value={patientData.observatii}
									rows={3}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
									placeholder="Descrieți pe scurt motivul consultației..."
								></textarea>
							</div>

							<div class="pt-4">
								<Button type="submit" size="lg" disabled={isLoading} class="w-full">
									{#if isLoading}
										Se procesează...
									{:else}
										Confirmă Programarea
									{/if}
								</Button>
							</div>
						</form>
					</div>
				</div>
			{/if}

			<!-- Step 7: Confirmation -->
			{#if currentStep === STEPS.CONFIRMATION}
				<div class="max-w-2xl mx-auto text-center">
					<div class="bg-white rounded-xl p-8 md:p-12 shadow-lg">
						<div
							class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
						>
							<span class="text-4xl text-green-600">✓</span>
						</div>

						<h2 class="text-2xl font-bold text-gray-900 mb-4">Programare Confirmată!</h2>
						<p class="text-gray-600 mb-6">
							Programarea dumneavoastră a fost înregistrată cu succes.
						</p>

						<div class="bg-gray-50 rounded-lg p-6 text-left mb-8">
							<h3 class="font-bold text-gray-900 mb-4">Detalii programare:</h3>
							<div class="space-y-2 text-sm">
								<p><strong>ID Programare:</strong> #{appointmentResult?.AppointmentId}</p>
								<p><strong>Medic:</strong> {selectedDoctor?.Name}</p>
								<p><strong>Serviciu:</strong> {selectedScope?.scop}</p>
								<p>
									<strong>Data:</strong>
									{selectedDate ? formatDate(selectedDate) : ''} la {selectedTimeSlot?.formatted}
								</p>
								<p><strong>Pacient:</strong> {patientData.prenume} {patientData.nume}</p>
								<p><strong>Telefon:</strong> {patientData.telefon}</p>
								{#if getPrice() > 0}
									<p class="text-primary font-bold mt-2">Preț: {getPrice()} RON</p>
								{/if}
							</div>
						</div>

						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<Button href="/">Pagina Principală</Button>
							<Button variant="secondary" onclick={resetBooking}>Programare Nouă</Button>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>

<!-- Contact Section -->
<section class="py-8 bg-white">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-xl font-bold text-gray-900 mb-3">Preferați să sunați?</h2>
			<p class="text-gray-600 mb-4">Ne puteți contacta direct pentru programări.</p>
			<a
				href="tel:+40234123456"
				class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
			>
				📞 +40 234 123 456
			</a>
		</div>
	</div>
</section>
