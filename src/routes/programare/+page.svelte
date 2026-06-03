<script lang="ts">
	import { formatPersonName } from '$lib/utils/format';

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
		PAYMENT: 7
	};

	const STEP_LABELS = ['Locație', 'Specialitate', 'Medic', 'Serviciu', 'Dată & oră', 'Date'];

	const RO_DAYS = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
	const RO_MONTHS_SHORT = [
		'ian',
		'feb',
		'mar',
		'apr',
		'mai',
		'iun',
		'iul',
		'aug',
		'sep',
		'oct',
		'nov',
		'dec'
	];

	const DOC_TONES = ['coral', 'lavender', 'turquoise', 'sunshine'];

	// State
	let currentStep = $state(STEPS.LOCATION);
	let isLoading = $state(false);
	let isRedirecting = $state(false);
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

	// Computed: Available dates from schedule
	let availableDates = $derived.by(() => {
		if (!schedule.length || !selectedDoctor) return [];

		const doctorSchedule = schedule.filter(
			(s) => Number(s.DoctorId) === Number(selectedDoctor!.DoctorId) && Number(s.IsAvailable) === 1
		);
		const dates = new Set<string>();

		doctorSchedule.forEach((slot) => {
			const date = slot.StartDateTime.split('T')[0];
			dates.add(date);
		});

		return Array.from(dates).sort();
	});

	// Computed: Time slots for selected date
	//
	// MedSoft returns large shift-window blocks (e.g. 08:00–16:30, IsAvailable=1).
	// We subdivide each window using SlotDuration as the grid step (includes
	// the doctor's break between patients) and scope.durata as the actual
	// appointment length. Example: SlotDuration=50 → step=60 → slots at
	// 08:00, 09:00, 10:00… (not 08:00, 08:50, 09:40…).
	let availableTimeSlots = $derived.by(() => {
		if (!selectedDate || !schedule.length || !selectedDoctor || !selectedScope) return [];

		// Round up to nearest 15 min so slots land on clean times
		// (e.g. SlotDuration=50 → step=60 → 08:00, 09:00, 10:00…)
		const step = Math.ceil(selectedDoctor.SlotDuration / 15) * 15;
		const duration = selectedScope.durata || step; // actual appointment length
		const doctorSchedule = schedule.filter(
			(s) => Number(s.DoctorId) === Number(selectedDoctor!.DoctorId) && Number(s.IsAvailable) === 1
		);

		const slots: TimeSlot[] = [];

		doctorSchedule.forEach((scheduleSlot) => {
			const slotDate = scheduleSlot.StartDateTime.split('T')[0];
			if (slotDate !== selectedDate) return;

			const start = new Date(scheduleSlot.StartDateTime);
			const end = new Date(scheduleSlot.EndDateTime);

			let current = new Date(start);
			while (current.getTime() + duration * 60000 <= end.getTime()) {
				const slotEnd = new Date(current.getTime() + duration * 60000);
				slots.push({
					start: new Date(current),
					end: slotEnd,
					formatted: current.toLocaleTimeString('ro-RO', {
						hour: '2-digit',
						minute: '2-digit',
						timeZone: 'Europe/Bucharest'
					})
				});
				// Advance by the grid step (not scope.durata) to respect the break
				current = new Date(current.getTime() + step * 60000);
			}
		});

		return slots;
	});

	// Time slots split into morning / afternoon for nicer grouping
	let groupedSlots = $derived.by(() => {
		const morning: TimeSlot[] = [];
		const afternoon: TimeSlot[] = [];
		for (const s of availableTimeSlots) {
			const h = parseInt(s.formatted.slice(0, 2), 10);
			if (h < 12) morning.push(s);
			else afternoon.push(s);
		}
		return { morning, afternoon };
	});

	// Deep-link: a ?specialty=<slug> query param (e.g. from "Programează"
	// buttons on the services page) pre-selects the matching specialty.
	// Matching is by NORMALISED NAME, never by MedSoft id — so it keeps
	// working when MedSoft ids change, and falls back to the normal flow
	// (no error) if nothing matches. Consumed once.
	let deepLinkConsumed = false;

	function normalizeName(s: string): string {
		return s
			.toLowerCase()
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '') // strip diacritics (combining marks)
			.replace(/[^a-z0-9]+/g, ' ')
			.trim();
	}

	function tryResolveSpecialtyDeepLink() {
		if (deepLinkConsumed) return;
		const slug = new URLSearchParams(window.location.search).get('specialty');
		if (!slug) {
			deepLinkConsumed = true;
			return;
		}
		if (!specialties.length) return; // specialties not loaded yet — wait
		deepLinkConsumed = true;
		const target = normalizeName(slug);
		const match =
			specialties.find((s) => normalizeName(s.Name) === target) ||
			specialties.find(
				(s) =>
					normalizeName(s.Name).startsWith(target) || target.startsWith(normalizeName(s.Name))
			) ||
			specialties.find(
				(s) => normalizeName(s.Name).includes(target) || target.includes(normalizeName(s.Name))
			);
		if (match) selectSpecialty(match);
	}

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
		} catch {
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
				tryResolveSpecialtyDeepLink();
			} else {
				error = data.error;
			}
		} catch {
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
		} catch {
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
		} catch {
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
		} catch {
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

	function selectDate(date: string) {
		selectedDate = date;
		selectedTimeSlot = null;
	}

	function selectTimeSlot(slot: TimeSlot) {
		selectedTimeSlot = slot;
		currentStep = STEPS.PATIENT;
	}

	// Jump to any step (used by the breadcrumb chips and the Back button).
	// Clears the selection at the target step and everything after it, so the
	// user re-picks from there. Mirrors the prototype's jumpTo semantics.
	function jumpTo(target: number) {
		error = '';
		if (target <= STEPS.LOCATION) {
			selectedLocation = null;
			specialties = [];
		}
		if (target <= STEPS.SPECIALTY) {
			selectedSpecialty = null;
			doctors = [];
		}
		if (target <= STEPS.DOCTOR) {
			selectedDoctor = null;
			scopes = [];
		}
		if (target <= STEPS.SERVICE) {
			selectedScope = null;
			schedule = [];
		}
		if (target <= STEPS.DATETIME) {
			selectedDate = '';
			selectedTimeSlot = null;
		}
		currentStep = Math.max(STEPS.LOCATION, target);
	}

	function goBack() {
		if (currentStep > STEPS.LOCATION) jumpTo(currentStep - 1);
	}

	// ── Display helpers ──────────────────────────────────────────────────
	function shortenName(name: string): string {
		if (!name) return '';
		if (name.length <= 22) return name;
		const parts = name.split(' ');
		if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
		return name.slice(0, 20) + '…';
	}

	function initialsOf(name: string): string {
		return name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	function parseLocalDate(iso: string): Date {
		return new Date(iso + 'T00:00:00');
	}

	function dayBadge(iso: string): string | null {
		const d = parseLocalDate(iso);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today.getTime() + 86400000);
		if (d.toDateString() === today.toDateString()) return 'Azi';
		if (d.toDateString() === tomorrow.toDateString()) return 'Mâine';
		return null;
	}

	function formatShortDate(iso: string): string {
		return parseLocalDate(iso).toLocaleDateString('ro-RO', {
			day: 'numeric',
			month: 'short',
			timeZone: 'Europe/Bucharest'
		});
	}

	function stepChip(n: number): string {
		switch (n) {
			case STEPS.LOCATION:
				return selectedLocation?.LocationName ?? '';
			case STEPS.SPECIALTY:
				return selectedSpecialty?.Name ?? '';
			case STEPS.DOCTOR:
				return shortenName(formatPersonName(selectedDoctor?.Name));
			case STEPS.SERVICE:
				return selectedScope?.scop ?? '';
			case STEPS.DATETIME:
				if (!selectedDate) return '';
				return (
					formatShortDate(selectedDate) +
					(selectedTimeSlot ? ` · ${selectedTimeSlot.formatted}` : '')
				);
			default:
				return '';
		}
	}

	// Helper function to format date for MedSoft API (YYYY-MM-DD HH:MM:SS)
	// Always uses Europe/Bucharest so it works even if the patient is abroad
	function formatDateTimeForMedSoft(date: Date): string {
		const parts = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Europe/Bucharest',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).formatToParts(date);

		const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
		return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
	}

	async function proceedToPayment() {
		if (!selectedDoctor || !selectedLocation || !selectedTimeSlot) return;

		const price = getPrice();

		// If price is 0, create appointment directly (free consultations)
		if (price === 0) {
			isLoading = true;
			error = '';
			try {
				const res = await fetch('/api/medsoft/appointment', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						doctorId: selectedDoctor.DoctorId,
						locationId: selectedLocation.LocationId,
						startDateTime: formatDateTimeForMedSoft(selectedTimeSlot.start),
						endDateTime: formatDateTimeForMedSoft(selectedTimeSlot.end),
						patientName: `${patientData.nume} ${patientData.prenume}`.toUpperCase(),
						patientEmail: patientData.email || undefined,
						patientPhoneNumber: patientData.telefon,
						appointmentDetails: selectedScope?.scop || 'Consultație',
						appointmentNotes: patientData.observatii || undefined
					})
				});
				const data = await res.json();
				if (data.success) {
					window.location.href = '/confirmare';
				} else {
					error = data.error || 'Eroare la crearea programării';
					// Reload schedule to refresh available slots
					selectedDate = '';
					selectedTimeSlot = null;
					currentStep = STEPS.DATETIME;
					loadSchedule(selectedDoctor!.DoctorId);
				}
			} catch {
				error = 'Eroare la conectarea cu serverul';
			} finally {
				isLoading = false;
			}
			return;
		}

		// Paid service — initiate Netopia payment
		isLoading = true;
		error = '';

		try {
			const res = await fetch('/api/payment/initiate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					doctorId: selectedDoctor.DoctorId,
					locationId: selectedLocation.LocationId,
					startDateTime: formatDateTimeForMedSoft(selectedTimeSlot.start),
					endDateTime: formatDateTimeForMedSoft(selectedTimeSlot.end),
					patientName: `${patientData.nume} ${patientData.prenume}`.toUpperCase(),
					patientNume: patientData.nume.toUpperCase(),
					patientPrenume: patientData.prenume.toUpperCase(),
					patientEmail: patientData.email || undefined,
					patientPhoneNumber: patientData.telefon,
					appointmentDetails: selectedScope?.scop || 'Consultație',
					appointmentNotes: patientData.observatii || undefined,
					amount: price,
					doctorName: formatPersonName(selectedDoctor.Name),
					locationName: selectedLocation.LocationName,
					displayDate: selectedDate,
					displayTime: selectedTimeSlot.formatted
				})
			});

			const result = await res.json();

			if (!result.success) {
				error = result.error || 'Eroare la inițializarea plății';
				isLoading = false;

				// If slot is no longer available (409), reload schedule & reset selection
				if (res.status === 409) {
					selectedDate = '';
					selectedTimeSlot = null;
					currentStep = STEPS.DATETIME;
					loadSchedule(selectedDoctor!.DoctorId);
				}
				return;
			}

			// Save booking summary to localStorage so /confirmare can display it
			if (result.orderId && result.summary) {
				try {
					localStorage.setItem(`psimed_booking_${result.orderId}`, JSON.stringify(result.summary));
				} catch {
					// localStorage not available
				}
			}

			// Redirect to Netopia payment page via auto-submitting form
			isRedirecting = true;
			const form = document.createElement('form');
			form.method = 'post';
			form.action = result.payment_url;
			for (const [name, value] of [
				['env_key', result.env_key],
				['data', result.data]
			]) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = name;
				input.value = value as string;
				form.appendChild(input);
			}
			document.body.appendChild(form);
			form.submit();
		} catch {
			error = 'Eroare la conectarea cu serverul de plăți';
			isLoading = false;
		}
	}

	function formatDate(dateStr: string): string {
		const date = parseLocalDate(dateStr);
		return date.toLocaleDateString('ro-RO', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'Europe/Bucharest'
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

<div class="bk-root" lang="ro">
	<!-- ── Hero ─────────────────────────────────────────────────────────── -->
	<header class="bk-hero">
		<div class="bk-hero__inner">
			<span class="bk-hero__eyebrow">Clinica Sf. Gherasim · Bacău</span>
			<h1 class="bk-hero__title">Programare <em>online</em></h1>
			<p class="bk-hero__sub">
				Pas cu pas, în mai puțin de două minute. Plată securizată și confirmare pe loc.
			</p>
		</div>
	</header>

	<!-- ── Sticky stepper + selection chips ─────────────────────────────── -->
	{#if currentStep <= STEPS.PATIENT}
		<div class="bk-stage">
			<div class="bk-rail">
				{#each STEP_LABELS as label, i}
					{@const n = i + 1}
					{@const state =
						n < currentStep ? 'done' : n === currentStep ? 'current' : 'todo'}
					<button
						type="button"
						class="bk-pill bk-pill--{state}"
						disabled={state !== 'done'}
						onclick={() => state === 'done' && jumpTo(n)}
						title={state === 'done' ? `Modifică ${label.toLowerCase()}` : label}
					>
						<span class="bk-pill__num">
							{#if state === 'done'}✓{:else}{n}{/if}
						</span>
						<span class="bk-pill__label">{label}</span>
					</button>
					{#if n < STEP_LABELS.length}
						<span class="bk-railbar {n < currentStep ? 'is-done' : ''}"></span>
					{/if}
				{/each}
			</div>

			<!-- Selection chips (completed steps) -->
			{#if currentStep > STEPS.LOCATION}
				<div class="bk-chips">
					{#each STEP_LABELS as label, i}
						{@const n = i + 1}
						{#if n < currentStep && stepChip(n)}
							<button type="button" class="bk-chip" onclick={() => jumpTo(n)}>
								<span class="bk-chip__k">{label}</span>
								<span class="bk-chip__v">{stepChip(n)}</span>
								<svg class="bk-chip__edit" width="11" height="11" viewBox="0 0 14 14"
									><path
										d="M9.5 2.5l2 2L5 11l-2.5.5L3 9z"
										fill="none"
										stroke="currentColor"
										stroke-width="1.3"
										stroke-linejoin="round"
									/></svg
								>
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- ── Main ─────────────────────────────────────────────────────────── -->
	<main class="bk-main">
		{#if error}
			<div class="bk-alert">{error}</div>
		{/if}

		<!-- Step 1: Location -->
		{#if currentStep === STEPS.LOCATION}
			<section class="bk-screen">
				<div class="bk-head">
					<p class="bk-kicker">Pasul 1 din 6</p>
					<h2 class="bk-title">Unde vrei să vii?</h2>
					<p class="bk-sub">Alege clinica la care preferi să te programezi.</p>
				</div>
				{#if isLoading}
					<div class="bk-grid bk-grid--2">
						{#each Array(2) as _}
							<div class="bk-skel-card"><div class="bk-skel bk-skel--t"></div><div class="bk-skel bk-skel--s"></div></div>
						{/each}
					</div>
				{:else}
					<div class="bk-grid bk-grid--2">
						{#each locations as location}
							<button type="button" class="bk-card bk-card--loc" onclick={() => selectLocation(location)}>
								<span class="bk-ico">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/></svg>
								</span>
								<span class="bk-card__body">
									<span class="bk-card__title">{location.LocationName}</span>
									{#if location.LocationAddress}
										<span class="bk-card__meta">{location.LocationAddress}</span>
									{/if}
								</span>
								<span class="bk-chev" aria-hidden="true">
									<svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- Step 2: Specialty -->
		{#if currentStep === STEPS.SPECIALTY}
			<section class="bk-screen">
				<div class="bk-head">
					<button type="button" class="bk-back" onclick={goBack}>
						<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						Înapoi
					</button>
					<p class="bk-kicker">Pasul 2 din 6</p>
					<h2 class="bk-title">Ce fel de consultație cauți?</h2>
					<p class="bk-sub">Alege specialitatea care îți corespunde nevoii.</p>
				</div>
				{#if isLoading}
					<div class="bk-grid bk-grid--3">
						{#each Array(6) as _}
							<div class="bk-skel-card"><div class="bk-skel bk-skel--t"></div></div>
						{/each}
					</div>
				{:else}
					<div class="bk-grid bk-grid--3">
						{#each specialties as specialty}
							<button type="button" class="bk-card bk-card--spec" onclick={() => selectSpecialty(specialty)}>
								<span class="bk-glyph">{initialsOf(specialty.Name)}</span>
								<span class="bk-card__body">
									<span class="bk-card__title">{specialty.Name}</span>
								</span>
								<span class="bk-chev" aria-hidden="true">
									<svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- Step 3: Doctor -->
		{#if currentStep === STEPS.DOCTOR}
			<section class="bk-screen">
				<div class="bk-head">
					<button type="button" class="bk-back" onclick={goBack}>
						<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						Înapoi
					</button>
					<p class="bk-kicker">Pasul 3 din 6</p>
					<h2 class="bk-title">Cu ce specialist vrei să te programezi?</h2>
					<p class="bk-sub">Toți specialiștii de mai jos au disponibilitate în următoarele 30 de zile.</p>
				</div>
				{#if isLoading}
					<div class="bk-grid bk-grid--2">
						{#each Array(3) as _}
							<div class="bk-skel-card"><div class="bk-skel bk-skel--av"></div><div style="flex:1"><div class="bk-skel bk-skel--t"></div><div class="bk-skel bk-skel--s"></div></div></div>
						{/each}
					</div>
				{:else}
					<div class="bk-grid bk-grid--2">
						{#each doctors as doctor, i}
							{@const tone = DOC_TONES[i % DOC_TONES.length]}
							<button type="button" class="bk-card bk-card--doc tone-{tone}" onclick={() => selectDoctor(doctor)}>
								<span class="bk-doc-top">
									<span class="bk-avatar avatar-{tone}"><span>{initialsOf(doctor.Name)}</span></span>
									<span class="bk-doc-id">
										<span class="bk-doc-name">{formatPersonName(doctor.Name)}</span>
										<span class="bk-doc-meta">
											{#if doctor.Grade}<span class="bk-grade grade-{tone}">{doctor.Grade}</span>{/if}
										</span>
									</span>
								</span>
								<span class="bk-doc-spec">{doctor.SpecialtyName}</span>
								<span class="bk-doc-bottom">
									<span class="bk-doc-foot">
										<span class="bk-doc-foot-k">Durată consultație</span>
										<span class="bk-doc-foot-v">{doctor.SlotDuration} min</span>
									</span>
									<span class="bk-doc-foot">
										<span class="bk-doc-foot-k">Disponibil</span>
										<span class="bk-doc-foot-v bk-avail">Următoarele 30 zile</span>
									</span>
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- Step 4: Service/Scope -->
		{#if currentStep === STEPS.SERVICE}
			<section class="bk-screen">
				<div class="bk-head">
					<button type="button" class="bk-back" onclick={goBack}>
						<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						Înapoi
					</button>
					<p class="bk-kicker">Pasul 4 din 6</p>
					<h2 class="bk-title">Ce tip de consultație îți dorești?</h2>
					<p class="bk-sub">Durata și prețul sunt informative — confirmarea finală o primești la programare.</p>
				</div>
				{#if isLoading}
					<div class="bk-grid bk-grid--2">
						{#each Array(3) as _}
							<div class="bk-skel-card"><div style="flex:1"><div class="bk-skel bk-skel--t"></div><div class="bk-skel bk-skel--s"></div></div></div>
						{/each}
					</div>
				{:else}
					<div class="bk-grid bk-grid--2">
						{#each scopes as scope}
							{@const price = scope.lista_servicii?.[0]?.pret ?? 0}
							<button type="button" class="bk-card bk-card--svc" onclick={() => selectScope(scope)}>
								<span class="bk-card__body">
									<span class="bk-card__title">{scope.scop}</span>
								</span>
								<span class="bk-svc-foot">
									<span class="bk-svc-dur">
										<svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="6" cy="6" r="4.5"/><path d="M6 3.5V6l1.6 1.2"/></svg>
										{scope.durata} min
									</span>
									<span class="bk-svc-price {price === 0 ? 'is-free' : ''}">
										{#if price === 0}Gratuit{:else}{price} <small>RON</small>{/if}
									</span>
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- Step 5: Date & Time -->
		{#if currentStep === STEPS.DATETIME}
			<section class="bk-screen">
				<div class="bk-head">
					<button type="button" class="bk-back" onclick={goBack}>
						<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						Înapoi
					</button>
					<p class="bk-kicker">Pasul 5 din 6</p>
					<h2 class="bk-title">Când îți e mai ușor să vii?</h2>
					<p class="bk-sub">
						{formatPersonName(selectedDoctor?.Name)} · {selectedScope?.scop?.toLowerCase()}{#if getPrice() > 0} · {getPrice()} RON{/if}
					</p>
				</div>

				{#if isLoading}
					<div class="bk-dt-loading">
						<div class="bk-spinner"></div>
						<p>Verificăm disponibilitatea…</p>
					</div>
				{:else if availableDates.length === 0}
					<div class="bk-empty">
						<p class="bk-empty__title">Nu există disponibilitate în următoarele 30 de zile.</p>
						<p class="bk-empty__sub">Te rugăm să ne contactezi telefonic: <a href="tel:+40711039666">+40 711 039 666</a></p>
					</div>
				{:else}
					<div class="bk-dt">
						<!-- Day strip -->
						<div class="bk-daystrip-wrap">
							<p class="bk-dt-hint">Alege o zi</p>
							<div class="bk-daystrip" role="radiogroup" aria-label="Zile disponibile">
								{#each availableDates as iso}
									{@const d = parseLocalDate(iso)}
									{@const badge = dayBadge(iso)}
									<button
										type="button"
										role="radio"
										aria-checked={iso === selectedDate}
										class="bk-day {iso === selectedDate ? 'is-sel' : ''}"
										onclick={() => selectDate(iso)}
									>
										{#if badge}<span class="bk-day__badge">{badge}</span>{/if}
										<span class="bk-day__dow">{RO_DAYS[d.getDay()]}</span>
										<span class="bk-day__num">{d.getDate()}</span>
										<span class="bk-day__mon">{RO_MONTHS_SHORT[d.getMonth()]}</span>
										<span class="bk-day__dot"></span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Time panel -->
						<div class="bk-timepanel">
							{#if !selectedDate}
								<div class="bk-times-ph">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".35"><circle cx="20" cy="20" r="13"/><path d="M20 13v7l5 3"/></svg>
									<p>Orele apar aici după ce alegi o zi</p>
								</div>
							{:else if availableTimeSlots.length === 0}
								<div class="bk-empty bk-empty--sm">Nu există ore disponibile pentru ziua aleasă.</div>
							{:else}
								<p class="bk-time-date">{formatDate(selectedDate)}</p>
								{#if groupedSlots.morning.length}
									<div class="bk-time-group">
										<div class="bk-time-ghead">
											<span class="bk-time-ico">☀</span>
											<span class="bk-time-gtitle">Dimineața</span>
											<span class="bk-time-count">{groupedSlots.morning.length} ore</span>
										</div>
										<div class="bk-times">
											{#each groupedSlots.morning as slot}
												<button type="button" class="bk-time {selectedTimeSlot?.formatted === slot.formatted ? 'is-sel' : ''}" onclick={() => selectTimeSlot(slot)}>{slot.formatted}</button>
											{/each}
										</div>
									</div>
								{/if}
								{#if groupedSlots.afternoon.length}
									<div class="bk-time-group">
										<div class="bk-time-ghead">
											<span class="bk-time-ico">◐</span>
											<span class="bk-time-gtitle">După-amiaza</span>
											<span class="bk-time-count">{groupedSlots.afternoon.length} ore</span>
										</div>
										<div class="bk-times">
											{#each groupedSlots.afternoon as slot}
												<button type="button" class="bk-time {selectedTimeSlot?.formatted === slot.formatted ? 'is-sel' : ''}" onclick={() => selectTimeSlot(slot)}>{slot.formatted}</button>
											{/each}
										</div>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Step 6: Patient Data -->
		{#if currentStep === STEPS.PATIENT}
			<section class="bk-screen">
				<div class="bk-head">
					<button type="button" class="bk-back" onclick={goBack}>
						<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
						Înapoi
					</button>
					<p class="bk-kicker">Pasul 6 din 6 · Ultimul pas</p>
					<h2 class="bk-title">Doar câteva detalii și am terminat</h2>
					<p class="bk-sub">Verifică rezumatul programării și completează datele tale de contact.</p>
				</div>

				<div class="bk-final">
					<!-- Summary -->
					<aside class="bk-summary">
						<span class="bk-summary__strip"></span>
						<p class="bk-summary__eyebrow">Rezumatul programării</p>
						<div class="bk-summary__rows">
							<div class="bk-sum-row"><span class="bk-sum-k">Clinica</span><span class="bk-sum-v">{selectedLocation?.LocationName}</span></div>
							<div class="bk-sum-row"><span class="bk-sum-k">Specialitate</span><span class="bk-sum-v">{selectedSpecialty?.Name}</span></div>
							<div class="bk-sum-row"><span class="bk-sum-k">Medic</span><span class="bk-sum-vwrap"><span class="bk-sum-v">{formatPersonName(selectedDoctor?.Name)}</span>{#if selectedDoctor?.Grade}<span class="bk-sum-sub">{selectedDoctor.Grade}</span>{/if}</span></div>
							<div class="bk-sum-row"><span class="bk-sum-k">Serviciu</span><span class="bk-sum-vwrap"><span class="bk-sum-v">{selectedScope?.scop}</span><span class="bk-sum-sub">{selectedScope?.durata} min</span></span></div>
							<div class="bk-sum-row is-highlight"><span class="bk-sum-k">Când</span><span class="bk-sum-vwrap"><span class="bk-sum-v">{selectedDate ? formatDate(selectedDate) : ''}</span><span class="bk-sum-sub">ora {selectedTimeSlot?.formatted}</span></span></div>
						</div>
						<div class="bk-summary__total">
							<span>Total de plată</span>
							<span class="bk-summary__price">{#if getPrice() === 0}Gratuit{:else}{getPrice()} <small>RON</small>{/if}</span>
						</div>
						{#if getPrice() > 0}
							<p class="bk-summary__note">Plata se face online, securizat prin Netopia.</p>
						{/if}
					</aside>

					<!-- Form -->
					<form class="bk-form" onsubmit={(e) => { e.preventDefault(); proceedToPayment(); }}>
						<div class="bk-form__grid">
							<label class="bk-field">
								<span class="bk-field__lbl">Nume <em class="bk-req">*</em></span>
								<input type="text" required bind:value={patientData.nume} placeholder="Popescu" />
							</label>
							<label class="bk-field">
								<span class="bk-field__lbl">Prenume <em class="bk-req">*</em></span>
								<input type="text" required bind:value={patientData.prenume} placeholder="Ion" />
							</label>
							<label class="bk-field">
								<span class="bk-field__lbl">Telefon <em class="bk-req">*</em></span>
								<input type="tel" required bind:value={patientData.telefon} placeholder="0740 123 456" />
							</label>
							<label class="bk-field">
								<span class="bk-field__lbl">Email</span>
								<input type="email" bind:value={patientData.email} placeholder="ion@email.com" />
							</label>
						</div>
						<label class="bk-field bk-field--ta">
							<span class="bk-field__lbl">Observații (opțional)</span>
							<textarea rows={3} bind:value={patientData.observatii} placeholder="Pe scurt, motivul consultației sau ceva important pentru medic…"></textarea>
						</label>

						<label class="bk-consent">
							<input type="checkbox" required />
							<span>Am citit și sunt de acord cu <a href="/termeni-si-conditii" target="_blank">termenii</a> și <a href="/politica-confidentialitate" target="_blank">politica de confidențialitate</a>.</span>
						</label>

						<button type="submit" class="bk-cta" disabled={isLoading || isRedirecting}>
							{#if isRedirecting}
								Se redirectează spre plată…
							{:else if isLoading}
								Se procesează…
							{:else if getPrice() > 0}
								Continuă spre plată <span class="bk-cta__amt">{getPrice()} RON</span>
							{:else}
								Confirmă programarea
							{/if}
						</button>
						<p class="bk-form__foot">Programarea îți va apărea după confirmarea plății.</p>
					</form>
				</div>
			</section>
		{/if}

		<!-- Payment redirect overlay -->
		{#if isRedirecting}
			<div class="bk-redirect">
				<div class="bk-spinner"></div>
				<p class="bk-redirect__title">Se redirectează spre pagina de plată…</p>
				<p class="bk-redirect__sub">Veți fi redirecționat automat. Vă rugăm nu închideți pagina.</p>
			</div>
		{/if}
	</main>

	<!-- ── Support footer ───────────────────────────────────────────────── -->
	<footer class="bk-support">
		<div class="bk-support__inner">
			<div>
				<p class="bk-support__eyebrow">Preferi telefonul?</p>
				<p class="bk-support__title">Te ajutăm cu programarea</p>
			</div>
			<a href="tel:+40711039666" class="bk-support__cta">📞 +40 711 039 666</a>
		</div>
	</footer>
</div>

<style>
	/* ── Design tokens (scoped to the booking page) ────────────────────── */
	.bk-root {
		--accent: #dd4444;
		--accent-dark: #cc3333;
		--accent-light: #ffe0de;
		--accent-tint: #fff5f4;
		--bg: #faf6f1;
		--bg-elev: #ffffff;
		--bg-muted: #f3ede5;
		--ink: #1f1a17;
		--ink-2: #4a423d;
		--ink-3: #877a72;
		--line: rgba(31, 26, 23, 0.08);
		--line-strong: rgba(31, 26, 23, 0.14);
		--ok: #4ba85f;
		--r-card: 18px;
		--r-pill: 999px;
		--r-input: 12px;
		--shadow-soft: 0 1px 2px rgba(31, 26, 23, 0.04), 0 6px 24px -10px rgba(31, 26, 23, 0.1);
		--shadow-hover: 0 2px 4px rgba(31, 26, 23, 0.06), 0 14px 36px -10px rgba(31, 26, 23, 0.16);

		background: var(--bg);
		color: var(--ink);
		min-height: 100vh;
		hyphens: manual;
		-webkit-hyphens: manual;
		word-break: keep-all;
		overflow-wrap: normal;
	}
	.bk-root :global(*) {
		box-sizing: border-box;
	}

	/* ── Hero ───────────────────────────────────────────────────────────── */
	.bk-hero {
		position: relative;
		text-align: center;
		padding: 40px 24px 52px;
		background:
			radial-gradient(80% 60% at 80% 0%, var(--accent-light) 0%, transparent 60%),
			radial-gradient(70% 50% at 10% 100%, #ede9fe 0%, transparent 55%),
			linear-gradient(180deg, var(--bg-elev) 0%, var(--bg) 100%);
		overflow: hidden;
	}
	.bk-hero__inner {
		max-width: 760px;
		margin: 0 auto;
	}
	.bk-hero__eyebrow {
		display: inline-block;
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--accent-dark);
		background: rgba(255, 255, 255, 0.7);
		padding: 6px 14px;
		border-radius: var(--r-pill);
		border: 1px solid var(--line);
		margin-bottom: 20px;
	}
	.bk-hero__title {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: clamp(2.1rem, 5vw, 3rem);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin: 0 0 12px;
	}
	.bk-hero__title em {
		font-style: normal;
		color: var(--accent);
		background: linear-gradient(180deg, transparent 60%, var(--accent-light) 60%);
		padding: 0 8px;
	}
	.bk-hero__sub {
		font-size: 1.05rem;
		color: var(--ink-2);
		margin: 0 auto;
		max-width: 520px;
	}

	/* ── Sticky stage ───────────────────────────────────────────────────── */
	.bk-stage {
		position: sticky;
		top: 0;
		z-index: 30;
		background: rgba(250, 246, 241, 0.85);
		backdrop-filter: saturate(160%) blur(16px);
		-webkit-backdrop-filter: saturate(160%) blur(16px);
		border-bottom: 1px solid var(--line);
	}
	.bk-rail {
		max-width: 920px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 14px 20px 10px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.bk-rail::-webkit-scrollbar {
		display: none;
	}
	.bk-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px 6px 6px;
		border: 0;
		background: none;
		border-radius: var(--r-pill);
		color: var(--ink-3);
		font-weight: 600;
		font-size: 13.5px;
		flex-shrink: 0;
		cursor: pointer;
		font-family: inherit;
	}
	.bk-pill:disabled {
		cursor: default;
	}
	.bk-pill__num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--bg-muted);
		color: var(--ink-3);
		font-size: 12.5px;
		font-weight: 700;
	}
	.bk-pill--done {
		color: var(--ink);
	}
	.bk-pill--done .bk-pill__num {
		background: var(--accent);
		color: #fff;
	}
	.bk-pill--done:hover {
		color: var(--accent-dark);
	}
	.bk-pill--current {
		color: var(--accent-dark);
		background: var(--accent-tint);
	}
	.bk-pill--current .bk-pill__num {
		background: var(--accent);
		color: #fff;
		box-shadow: 0 0 0 4px var(--accent-light);
	}
	.bk-railbar {
		flex-shrink: 0;
		width: 16px;
		height: 2px;
		border-radius: 1px;
		background: var(--line);
	}
	.bk-railbar.is-done {
		background: var(--accent);
	}
	@media (max-width: 720px) {
		.bk-pill__label {
			display: none;
		}
		.bk-pill {
			padding: 4px;
		}
	}

	.bk-chips {
		max-width: 920px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 2px 20px 12px;
	}
	.bk-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px 6px 12px;
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: 12px;
		font-size: 12.5px;
		cursor: pointer;
		max-width: 100%;
		font-family: inherit;
	}
	.bk-chip:hover {
		border-color: var(--accent);
		background: var(--accent-tint);
	}
	.bk-chip__k {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-3);
		text-transform: uppercase;
	}
	.bk-chip__v {
		font-weight: 600;
		color: var(--ink);
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.bk-chip__edit {
		color: var(--ink-3);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.bk-chip:hover .bk-chip__edit {
		opacity: 1;
		color: var(--accent);
	}

	/* ── Main / screens ─────────────────────────────────────────────────── */
	.bk-main {
		max-width: 920px;
		margin: 0 auto;
		padding: 44px 20px 64px;
	}
	.bk-screen {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.bk-alert {
		max-width: 920px;
		margin: 0 auto 20px;
		background: #fff1f1;
		border-left: 4px solid var(--accent);
		color: #a02e2e;
		padding: 14px 16px;
		border-radius: 0 10px 10px 0;
		font-size: 14px;
	}
	.bk-head {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.bk-back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		align-self: flex-start;
		padding: 6px 12px 6px 8px;
		border: 0;
		background: none;
		border-radius: var(--r-pill);
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink-2);
		cursor: pointer;
		margin-bottom: 4px;
		font-family: inherit;
	}
	.bk-back:hover {
		background: var(--bg-muted);
		color: var(--ink);
	}
	.bk-kicker {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin: 0;
	}
	.bk-title {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.015em;
		margin: 0;
		line-height: 1.15;
	}
	.bk-sub {
		margin: 0;
		color: var(--ink-2);
		font-size: 1rem;
		max-width: 580px;
	}

	/* ── Cards grid ─────────────────────────────────────────────────────── */
	.bk-grid {
		display: grid;
		gap: 14px;
	}
	.bk-grid--2 {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}
	.bk-grid--3 {
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	}
	.bk-card {
		position: relative;
		display: flex;
		text-align: left;
		background: var(--bg-elev);
		border: 1px solid transparent;
		border-radius: var(--r-card);
		padding: 22px;
		box-shadow: var(--shadow-soft);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			box-shadow 0.2s,
			border-color 0.2s;
		font-family: inherit;
		color: inherit;
		width: 100%;
	}
	.bk-card:hover {
		border-color: var(--accent);
		box-shadow: var(--shadow-hover);
		transform: translateY(-2px);
	}
	.bk-ico,
	.bk-glyph {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--accent-tint);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-weight: 700;
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 14px;
	}
	.bk-card--loc,
	.bk-card--spec {
		flex-direction: row;
		align-items: flex-start;
		gap: 16px;
		padding-right: 42px;
	}
	.bk-card__body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.bk-card__title {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 16.5px;
		font-weight: 600;
		line-height: 1.25;
	}
	.bk-card__meta {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.45;
	}
	.bk-chev {
		position: absolute;
		right: 18px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--ink-3);
		opacity: 0;
		transition:
			opacity 0.15s,
			transform 0.15s,
			color 0.15s;
	}
	.bk-card:hover .bk-chev {
		opacity: 1;
		color: var(--accent);
		transform: translateY(-50%) translateX(2px);
	}

	/* Doctor card */
	.bk-card--doc {
		flex-direction: column;
		gap: 14px;
		padding-bottom: 0;
	}
	.bk-doc-top {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.bk-avatar {
		flex-shrink: 0;
		width: 52px;
		height: 52px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-weight: 700;
		color: #fff;
	}
	.bk-avatar span {
		color: #fff;
	}
	.avatar-coral {
		background: linear-gradient(135deg, #f06b6b, #c93a3a);
	}
	.avatar-lavender {
		background: linear-gradient(135deg, #b39ce8, #7c5fc7);
	}
	.avatar-turquoise {
		background: linear-gradient(135deg, #4cc5b8, #1d8e80);
	}
	.avatar-sunshine {
		background: linear-gradient(135deg, #ecc54a, #b89100);
	}
	.bk-doc-id {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.bk-doc-name {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 17px;
		font-weight: 600;
		line-height: 1.2;
		word-break: keep-all;
		overflow-wrap: anywhere;
	}
	.bk-doc-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	.bk-grade {
		display: inline-flex;
		align-items: center;
		padding: 2px 9px;
		font-size: 11.5px;
		font-weight: 700;
		border-radius: var(--r-pill);
		background: var(--bg-muted);
		color: var(--ink-2);
		text-transform: uppercase;
		white-space: nowrap;
	}
	.grade-coral {
		background: #ffe0de;
		color: #a02e2e;
	}
	.grade-lavender {
		background: #ede9fe;
		color: #5b3fb8;
	}
	.grade-turquoise {
		background: #d4f4f2;
		color: #1c7368;
	}
	.grade-sunshine {
		background: #fff4d1;
		color: #856a00;
	}
	.bk-doc-spec {
		font-size: 14px;
		color: var(--ink-2);
		border-left: 2px solid var(--accent-light);
		padding-left: 10px;
	}
	.bk-doc-bottom {
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin: 4px -22px 0;
		border-top: 1px solid var(--line);
	}
	.bk-doc-foot {
		padding: 12px 22px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 12.5px;
	}
	.bk-doc-foot + .bk-doc-foot {
		border-left: 1px solid var(--line);
	}
	.bk-doc-foot-k {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.bk-doc-foot-v {
		font-weight: 600;
		color: var(--ink);
	}
	.bk-doc-foot-v.bk-avail {
		color: var(--ok);
	}
	.tone-coral:hover {
		border-color: #dd4444;
	}
	.tone-lavender:hover {
		border-color: #9370db;
	}
	.tone-turquoise:hover {
		border-color: #2ba89b;
	}
	.tone-sunshine:hover {
		border-color: #d4a500;
	}

	/* Service card */
	.bk-card--svc {
		flex-direction: column;
		gap: 16px;
	}
	.bk-svc-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 14px;
		border-top: 1px solid var(--line);
	}
	.bk-svc-dur {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--ink-3);
		font-size: 13px;
		font-weight: 500;
	}
	.bk-svc-price {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 22px;
		font-weight: 700;
		color: var(--accent);
	}
	.bk-svc-price small {
		font-size: 12px;
		font-weight: 600;
		color: var(--ink-3);
	}
	.bk-svc-price.is-free {
		color: var(--ok);
		font-size: 18px;
	}

	/* ── Date & time ────────────────────────────────────────────────────── */
	.bk-dt {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.bk-dt-hint {
		font-size: 13px;
		color: var(--ink-3);
		margin: 0 0 12px;
		font-weight: 600;
	}
	.bk-daystrip-wrap {
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 18px;
		box-shadow: var(--shadow-soft);
	}
	.bk-daystrip {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
		scroll-snap-type: x mandatory;
	}
	.bk-day {
		flex-shrink: 0;
		scroll-snap-align: start;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 68px;
		padding: 12px 4px 14px;
		border: 0;
		border-radius: 14px;
		background: var(--bg-muted);
		color: var(--ink-2);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			transform 0.15s;
		font-family: inherit;
	}
	.bk-day:hover {
		background: var(--accent-tint);
		color: var(--accent);
		transform: translateY(-1px);
	}
	.bk-day.is-sel {
		background: var(--accent);
		color: #fff;
		box-shadow: 0 6px 16px -6px var(--accent);
	}
	.bk-day__badge {
		position: absolute;
		top: -7px;
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: var(--accent);
		color: #fff;
		padding: 1px 6px;
		border-radius: var(--r-pill);
	}
	.bk-day.is-sel .bk-day__badge {
		background: #fff;
		color: var(--accent);
	}
	.bk-day__dow {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		opacity: 0.7;
	}
	.bk-day__num {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 22px;
		font-weight: 700;
		margin: 1px 0;
		line-height: 1;
	}
	.bk-day__mon {
		font-size: 10.5px;
		opacity: 0.6;
	}
	.bk-day__dot {
		position: absolute;
		bottom: 6px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--ok);
	}
	.bk-day.is-sel .bk-day__dot {
		background: rgba(255, 255, 255, 0.85);
	}

	.bk-timepanel {
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 22px;
		box-shadow: var(--shadow-soft);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.bk-time-date {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 17px;
		font-weight: 600;
		margin: 0;
		text-transform: capitalize;
	}
	.bk-time-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.bk-time-ghead {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.bk-time-ico {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: var(--accent-tint);
		color: var(--accent);
		font-size: 13px;
	}
	.bk-time-gtitle {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-weight: 600;
		font-size: 13px;
	}
	.bk-time-count {
		font-size: 12px;
		color: var(--ink-3);
		margin-left: auto;
	}
	.bk-times {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
		gap: 8px;
	}
	.bk-time {
		padding: 10px 8px;
		border-radius: 10px;
		background: var(--bg-muted);
		color: var(--ink);
		font-weight: 600;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
		border: 1.5px solid transparent;
		cursor: pointer;
		transition: all 0.15s;
		font-family: inherit;
	}
	.bk-time:hover {
		background: var(--accent-tint);
		color: var(--accent);
		border-color: var(--accent-light);
	}
	.bk-time.is-sel {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
		box-shadow: 0 4px 14px -4px var(--accent);
	}
	.bk-times-ph {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 40px 20px;
		text-align: center;
		color: var(--ink-3);
		font-size: 14px;
	}
	.bk-dt-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 48px;
		color: var(--ink-3);
	}

	/* ── Empty state ────────────────────────────────────────────────────── */
	.bk-empty {
		background: var(--bg-elev);
		border: 1.5px dashed var(--line-strong);
		border-radius: var(--r-card);
		padding: 36px;
		text-align: center;
		color: var(--ink-3);
	}
	.bk-empty--sm {
		padding: 24px;
		font-size: 14px;
	}
	.bk-empty__title {
		margin: 0 0 6px;
		font-weight: 600;
		color: var(--ink);
	}
	.bk-empty__sub {
		margin: 0;
		font-size: 13px;
	}

	/* ── Final (summary + form) ─────────────────────────────────────────── */
	.bk-final {
		display: grid;
		grid-template-columns: minmax(260px, 340px) 1fr;
		gap: 24px;
		align-items: start;
	}
	@media (max-width: 760px) {
		.bk-final {
			grid-template-columns: 1fr;
		}
	}
	.bk-summary {
		position: relative;
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 24px 26px;
		box-shadow: var(--shadow-soft);
		overflow: hidden;
	}
	.bk-summary__strip {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(180deg, var(--accent), var(--accent-dark));
	}
	.bk-summary__eyebrow {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0 0 14px;
	}
	.bk-summary__rows {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.bk-sum-row {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 14px;
		align-items: baseline;
		padding-bottom: 12px;
		border-bottom: 1px dashed var(--line);
	}
	.bk-sum-row:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}
	.bk-sum-k {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.bk-sum-vwrap {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.bk-sum-v {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
		text-transform: capitalize;
	}
	.bk-sum-sub {
		font-size: 13px;
		color: var(--ink-3);
	}
	.bk-sum-row.is-highlight {
		background: var(--accent-tint);
		border-radius: 10px;
		padding: 10px 12px;
		border-bottom: 0;
		margin: 0 -8px;
	}
	.bk-sum-row.is-highlight .bk-sum-v {
		color: var(--accent-dark);
	}
	.bk-summary__total {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-top: 18px;
		padding-top: 16px;
		border-top: 1.5px solid var(--line-strong);
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-weight: 700;
	}
	.bk-summary__total > span:first-child {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-3);
	}
	.bk-summary__price {
		font-size: 26px;
		color: var(--accent);
		letter-spacing: -0.02em;
	}
	.bk-summary__price small {
		font-size: 13px;
		color: var(--ink-3);
	}
	.bk-summary__note {
		margin: 12px 0 0;
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.bk-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.bk-form__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	@media (max-width: 520px) {
		.bk-form__grid {
			grid-template-columns: 1fr;
		}
	}
	.bk-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.bk-field__lbl {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.bk-req {
		color: var(--accent);
		font-style: normal;
	}
	.bk-field input,
	.bk-field textarea {
		width: 100%;
		padding: 12px 14px;
		border-radius: var(--r-input);
		border: 1.5px solid var(--line-strong);
		background: var(--bg-elev);
		font-size: 15px;
		font-family: inherit;
		color: var(--ink);
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}
	.bk-field textarea {
		resize: vertical;
		min-height: 80px;
	}
	.bk-field input:focus,
	.bk-field textarea:focus {
		outline: 0;
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-light);
	}
	.bk-consent {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 13px;
		color: var(--ink-2);
		line-height: 1.5;
		padding: 12px 14px;
		background: var(--bg-muted);
		border-radius: 12px;
		cursor: pointer;
	}
	.bk-consent input {
		width: 16px;
		height: 16px;
		accent-color: var(--accent);
		margin-top: 3px;
		flex-shrink: 0;
	}
	.bk-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 24px;
		background: var(--accent);
		color: #fff;
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-weight: 700;
		font-size: 16px;
		border: 0;
		border-radius: var(--r-input);
		width: 100%;
		cursor: pointer;
		box-shadow: 0 6px 20px -8px var(--accent);
		transition:
			background 0.15s,
			transform 0.1s,
			box-shadow 0.15s;
	}
	.bk-cta:hover:not(:disabled) {
		background: var(--accent-dark);
		box-shadow: 0 10px 28px -8px var(--accent);
	}
	.bk-cta:active:not(:disabled) {
		transform: translateY(1px);
	}
	.bk-cta:disabled {
		background: var(--bg-muted);
		color: var(--ink-3);
		cursor: not-allowed;
		box-shadow: none;
	}
	.bk-cta__amt {
		background: rgba(255, 255, 255, 0.18);
		padding: 4px 10px;
		border-radius: var(--r-pill);
		font-size: 14px;
	}
	.bk-form__foot {
		font-size: 12px;
		color: var(--ink-3);
		text-align: center;
		margin: 0;
	}

	/* ── Spinner / redirect ─────────────────────────────────────────────── */
	.bk-spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--accent-light);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: bk-spin 0.8s linear infinite;
	}
	@keyframes bk-spin {
		to {
			transform: rotate(360deg);
		}
	}
	.bk-redirect {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 64px 20px;
		text-align: center;
	}
	.bk-redirect__title {
		font-weight: 700;
		font-size: 18px;
		margin: 0;
	}
	.bk-redirect__sub {
		font-size: 14px;
		color: var(--ink-3);
		margin: 0;
	}

	/* ── Skeletons ──────────────────────────────────────────────────────── */
	.bk-skel-card {
		display: flex;
		gap: 14px;
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 22px;
		box-shadow: var(--shadow-soft);
	}
	.bk-skel {
		background: linear-gradient(90deg, var(--bg-muted) 0%, #ece3d9 50%, var(--bg-muted) 100%);
		background-size: 200% 100%;
		animation: bk-shimmer 1.4s ease-in-out infinite;
		border-radius: 6px;
	}
	.bk-skel--t {
		height: 16px;
		width: 60%;
		margin-bottom: 10px;
	}
	.bk-skel--s {
		height: 12px;
		width: 85%;
	}
	.bk-skel--av {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	@keyframes bk-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* ── Support footer ─────────────────────────────────────────────────── */
	.bk-support {
		background: var(--bg-elev);
		border-top: 1px solid var(--line);
		padding: 28px 20px;
	}
	.bk-support__inner {
		max-width: 920px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}
	.bk-support__eyebrow {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		margin: 0 0 4px;
	}
	.bk-support__title {
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		font-size: 17px;
		font-weight: 600;
		margin: 0;
	}
	.bk-support__cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 20px;
		background: var(--ink);
		color: #fff;
		border-radius: var(--r-pill);
		font-weight: 700;
		font-family: var(--font-family-display, 'Poppins', sans-serif);
		text-decoration: none;
		transition:
			background 0.15s,
			transform 0.1s;
	}
	.bk-support__cta:hover {
		background: var(--accent);
		transform: translateY(-1px);
	}
</style>
