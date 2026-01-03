<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
</script>

<svelte:head>
	<title>Evaluări Psihologice - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Evaluări psihologice complete, inclusiv diagnostic autism cu instrumente gold-standard (ADOS, ADI-R, NEPSY-II) în Bacău."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-accent-light via-white to-secondary-light py-16 md:py-20 pb-8 md:pb-10">
	<div class="container-custom">
		<div class="max-w-4xl">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900">
				Evaluări <span class="text-accent">Psihologice</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-700 leading-relaxed">
				Oferim evaluări psihologice comprehensive cu instrumente diagnostice de referință internațională, inclusiv diagnostic autism spectrum disorder (TSA) cu ADOS, ADI-R și NEPSY-II.
			</p>
		</div>
	</div>
</section>

<!-- Main Content -->
<section class="section-spacing bg-white">
	<div class="container-custom max-w-4xl">
		<!-- Intro Section -->
		<div class="bg-accent-light p-8 md:p-10 rounded-2xl border-l-4 border-accent mb-12">
			<p class="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
				Evaluările psihologice sunt esențiale pentru înțelegerea dificultăților cognitive, comportamentale și emoționale. Folosim cele mai avansate instrumente diagnostice pentru a oferi evaluări precise și complete, adaptate vârstei și nevoilor fiecărui pacient.
			</p>
		</div>

		<!-- Key Assessment Tools -->
		<div class="mb-12">
			<h2 class="text-3xl font-bold mb-8 text-gray-900">Instrumente Diagnostice</h2>
			<div class="space-y-6">
				<!-- ADOS -->
				<div class="bg-accent-light p-8 rounded-2xl border-t-4 border-accent">
					<div class="flex items-start gap-4 mb-4">
						<div class="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-white font-black" style="background-color: #2ba89b;">
							1
						</div>
						<h3 class="text-2xl font-bold text-accent-dark">ADOS – Autism Diagnostic Observation Schedule</h3>
					</div>
					<p class="text-gray-800 leading-relaxed mb-4">
						Instrument bazat pe observație directă pentru diagnosticul tulburărilor din spectrul autist. Utilizează activități structurate și semi-structurate pentru evaluarea comportamentelor sociale, comunicării și jocului.
					</p>
					<div class="space-y-3 text-gray-700">
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span><strong>Vârstă:</strong> De la 12 luni până la vârsta adulță</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span><strong>Avantaje:</strong> Măsurare obiectivă a simptomelor TSA și severității</span>
						</p>
					</div>
				</div>

				<!-- ADI-R -->
				<div class="bg-accent-light p-8 rounded-2xl border-t-4 border-accent">
					<div class="flex items-start gap-4 mb-4">
						<div class="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-white font-black" style="background-color: #2ba89b;">
							2
						</div>
						<h3 class="text-2xl font-bold text-accent-dark">ADI-R – Autism Diagnostic Interview – Revised</h3>
					</div>
					<p class="text-gray-800 leading-relaxed mb-4">
						Interviu clinic structurat desfășurat cu părinții sau îngrijitorii, explorând istoria dezvoltării timpurii, limbajul, interacțiunea socială și comportamentele repetitive.
					</p>
					<div class="space-y-3 text-gray-700">
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span><strong>Durată:</strong> 90–150 minute per sesiune</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span><strong>Beneficiu:</strong> Corelarea datelor observaționale cu istoria dezvoltării</span>
						</p>
					</div>
				</div>

				<!-- NEPSY-II -->
				<div class="bg-accent-light p-8 rounded-2xl border-t-4 border-accent">
					<div class="flex items-start gap-4 mb-4">
						<div class="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-white font-black" style="background-color: #2ba89b;">
							3
						</div>
						<h3 class="text-2xl font-bold text-accent-dark">NEPSY-II – Evaluarea Neuropsihologică a Copilului</h3>
					</div>
					<p class="text-gray-800 leading-relaxed mb-4">
						Baterie standardizată pentru copii între 3–16 ani, evaluând cinci domenii cognitive principale.
					</p>
					<div class="space-y-3 text-gray-700">
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span>Atenție și funcții executive</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span>Înțelegere și expresie lingvistică</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span>Memorie și învățare</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span>Percepție vizuospațială</span>
						</p>
						<p class="flex items-start gap-3">
							<span class="text-accent font-bold">✓</span>
							<span>Procesare senzoriomotorie și cognițție socială</span>
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- What We Treat -->
		<div class="grid md:grid-cols-2 gap-8 mb-12">
			<div class="bg-accent-light p-8 md:p-10 rounded-2xl border-t-4 border-accent">
				<div class="flex items-center gap-3 mb-6">
					<div class="shrink-0 w-10 h-10 flex items-center justify-center bg-accent rounded-full">
						<Icon name="check" size="20" class="text-white" />
					</div>
					<h2 class="text-2xl md:text-3xl font-bold text-accent-dark">Pentru ce condiții?</h2>
				</div>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Tulburări din spectrul autist (TSA)</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Dificultăți cognitive și de învățare</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Probleme de atenție și concentrare</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Dificultăți în dezvoltarea limbajului</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Întârzieri în dezvoltarea psihomotorie</span>
					</div>
				</div>
			</div>

			<div class="bg-accent-light p-8 md:p-10 rounded-2xl border-t-4 border-accent">
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Dificultăți de comportament și emoționale</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Probleme de memorie și funcții executive</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Screening și diagnostic complex</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Evaluări pentru scopuri educaționale</span>
					</div>
					<div class="flex items-start gap-3">
						<div class="shrink-0 w-6 h-6 flex items-center justify-center bg-accent rounded-lg text-white font-bold text-xs">
							✓
						</div>
						<span class="text-gray-800 font-medium text-base">Evaluări de competență și evaluări legale</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Process -->
		<div class="bg-accent-light p-8 md:p-10 rounded-2xl border-l-4 border-accent mb-12">
			<h2 class="text-2xl md:text-3xl font-bold text-accent-dark mb-6">Procesul de Evaluare</h2>
			<div class="space-y-5">
				<div class="flex gap-5 items-start">
					<div
						class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full"
						style="background-color: #2ba89b;"
					>
						1
					</div>
					<div class="flex-1 pt-2">
						<p class="text-lg text-gray-800 font-semibold">Consultație inițială și anamneză detaliată</p>
					</div>
				</div>
				<div class="flex gap-5 items-start">
					<div
						class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full"
						style="background-color: #2ba89b;"
					>
						2
					</div>
					<div class="flex-1 pt-2">
						<p class="text-lg text-gray-800 font-semibold">Aplicarea instrumentelor diagnostice standardizate</p>
					</div>
				</div>
				<div class="flex gap-5 items-start">
					<div
						class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full"
						style="background-color: #2ba89b;"
					>
						3
					</div>
					<div class="flex-1 pt-2">
						<p class="text-lg text-gray-800 font-semibold">Observații comportamentale și funcționale</p>
					</div>
				</div>
				<div class="flex gap-5 items-start">
					<div
						class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full"
						style="background-color: #2ba89b;"
					>
						4
					</div>
					<div class="flex-1 pt-2">
						<p class="text-lg text-gray-800 font-semibold">Analiza și interpretarea datelor</p>
					</div>
				</div>
				<div class="flex gap-5 items-start">
					<div
						class="shrink-0 w-12 h-12 flex items-center justify-center font-black text-lg shadow-md text-white rounded-full"
						style="background-color: #2ba89b;"
					>
						5
					</div>
					<div class="flex-1 pt-2">
						<p class="text-lg text-gray-800 font-semibold">Raport final detaliat cu recomandări</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Trust Indicators -->
		<div class="grid md:grid-cols-3 gap-6 mb-12">
			<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
				<div class="text-4xl mb-3">🔬</div>
				<h3 class="font-bold text-gray-900 mb-1">Gold Standard</h3>
				<p class="text-gray-600 text-sm">Instrumente diagnostice internaționale</p>
			</div>
			<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
				<div class="text-4xl mb-3">👨‍⚕️</div>
				<h3 class="font-bold text-gray-900 mb-1">Specialiști Certificați</h3>
				<p class="text-gray-600 text-sm">Psihologi cu certificare în evaluări complexe</p>
			</div>
			<div class="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
				<div class="text-4xl mb-3">📋</div>
				<h3 class="font-bold text-gray-900 mb-1">Rapoarte Detaliate</h3>
				<p class="text-gray-600 text-sm">Documente complete cu recomandări practice</p>
			</div>
		</div>

		<!-- Strong CTA Section -->
		<div class="bg-accent-light p-10 md:p-12 rounded-3xl border-4 border-accent text-center shadow-xl">
			<h2 class="text-3xl md:text-4xl font-black text-accent-dark mb-4">Gata să Programezi o Evaluare?</h2>
			<p class="text-lg text-gray-700 mb-8 leading-relaxed">
				Contactează-ne pentru a programa o evaluare psihologică comprehensive. Suntem aici să te ajutăm cu răspunsuri clare și recomandări personalizate.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare?service=psihologie-clinica" variant="primary" size="lg">
					📅 Programează Evaluare
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					💬 Contactează-ne
				</Button>
			</div>
			<p class="text-sm text-gray-600 mt-6">
				Evaluările inițiale includ consultație și anamneză detaliată. Durata și costul vor fi discutate pe baza nevoilor tale.
			</p>
		</div>
	</div>
</section>

<!-- Bottom CTA Section -->
<section class="section-spacing bg-linear-to-br from-accent-light to-secondary-light">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center border-4 border-accent/10">
			<div class="text-6xl md:text-7xl mb-6">🧩</div>
			<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-6">
				Înțelegere și Diagnostic Precis
			</h2>
			<p class="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
				Evaluările psihologice comprehensive sunt crucial pentru a înțelege dificultățile tale și pentru a plani un tratament eficace. Fii parte din comunitatea noastră de pacienți care au primit răspunsuri clare.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button href="/programare?service=psihologie-clinica" variant="primary" size="lg">
					🗓️ Programează Evaluare
				</Button>
				<Button href="/contact" variant="secondary" size="lg">
					📞 Sună-ne Astăzi
				</Button>
			</div>
		</div>
	</div>
</section>
