<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<svelte:head>
	<title>Politica de Confidentialitate - Clinica Sf. Gherasim</title>
	<meta name="description" content="Politica de confidentialitate a Clinicii Sf. Gherasim - PSIMED din Bacau." />
</svelte:head>

<section class="py-16 bg-gray-50">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-black text-gray-900 mb-8">Politica de Confidentialitate</h1>

			<div class="bg-white rounded-xl p-8 shadow-sm space-y-6 text-gray-700">
				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">1. Informatii Generale</h2>
					<p>
						Clinica Sf. Gherasim - PSIMED respecta confidentialitatea datelor dumneavoastra personale.
						Aceasta politica descrie modul in care colectam, folosim si protejam informatiile dumneavoastra.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">2. Date Colectate</h2>
					<p>Colectam urmatoarele tipuri de date:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>Nume si prenume</li>
						<li>Numar de telefon</li>
						<li>Adresa de email</li>
						<li>Informatii medicale relevante pentru consultatii</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">3. Scopul Prelucrarii</h2>
					<p>Datele dumneavoastra sunt utilizate pentru:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>Programarea si gestionarea consultatiilor</li>
						<li>Comunicarea privind programarile</li>
						<li>Furnizarea serviciilor medicale</li>
						<li>Respectarea obligatiilor legale</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">4. Protectia Datelor</h2>
					<p>
						Implementam masuri tehnice si organizatorice adecvate pentru a proteja datele
						dumneavoastra impotriva accesului neautorizat, pierderii sau distrugerii.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">5. Drepturile Dumneavoastra</h2>
					<p>Aveti dreptul sa:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>Accesati datele dumneavoastra personale</li>
						<li>Solicitati rectificarea datelor incorecte</li>
						<li>Solicitati stergerea datelor</li>
						<li>Va opuneti prelucrarii datelor</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">6. Contact</h2>
					<p>
						Pentru orice intrebari legate de datele dumneavoastra personale, ne puteti contacta la:
					</p>
					<p class="mt-2">
						<strong>Email:</strong> office@psimed.ro<br />
						<strong>Telefon:</strong> 0711 039 666
					</p>
				</section>

				<div class="pt-6 border-t border-gray-200">
					<p class="text-sm text-gray-500">
						Ultima actualizare: Februarie 2026
					</p>
				</div>
			</div>

			<div class="mt-8 text-center">
				<Button href="/" variant="secondary">Inapoi la pagina principala</Button>
			</div>
		</div>
	</div>
</section>
