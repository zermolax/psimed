<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<svelte:head>
	<title>Politica de Livrare - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Politica de livrare și confirmare a programărilor la Clinica Sf. Gherasim - PSIMED din Bacău."
	/>
</svelte:head>

<section class="py-16 bg-gray-50">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-black text-gray-900 mb-8">Politica de Livrare</h1>

			<div class="bg-white rounded-xl p-8 shadow-sm space-y-6 text-gray-700">
				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">
						1. Ce Reprezintă „Livrarea" unui Serviciu Medical Online
					</h2>
					<p>
						Prin natura serviciilor oferite de PSI-MIND S.R.L. (consultații medicale, evaluări
						psihologice, psihoterapie), „livrarea" nu implică trimiterea unui produs fizic, ci
						<strong>confirmarea și asigurarea accesului la consultația programată</strong> la data și
						ora aleasă de pacient prin intermediul platformei online.
					</p>
					<p class="mt-3">
						Serviciul se consideră „livrat" în momentul în care pacientul se prezintă la consultație
						la data și ora stabilite și beneficiază efectiv de serviciul rezervat.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">2. Procesul de Confirmare</h2>
					<p>Etapele procesului de programare online sunt:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>Pacientul completează formularul de programare online (pași 1–6)</li>
						<li>Se efectuează plata prin procesatorul securizat Netopia mobilPay</li>
						<li>
							<strong>Imediat după plata cu succes</strong>, pacientul este redirecționat pe pagina de
							confirmare unde sunt afișate detaliile complete ale programării
						</li>
						<li>
							Programarea este înregistrată automat în sistemul de gestiune al clinicii (MedSoft)
						</li>
					</ul>
					<p class="mt-3">
						Nu se transmit confirmări separate prin email în prezent. Pagina de confirmare afișată
						imediat după plată reprezintă dovada programării. Vă recomandăm să salvați sau să
						printați această pagină.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">
						3. Termenul de Prestare a Serviciului
					</h2>
					<p>
						Serviciul medical rezervat se prestează <strong>la data și ora aleasă</strong> de pacient
						în momentul efectuării programării. Nu există o perioadă de „livrare" — pacientul selectează
						direct intervalul orar disponibil în calendar.
					</p>
					<p class="mt-3">
						În cazul în care, din motive obiective (urgențe medicale, situații neprevăzute), clinica
						nu poate onora o programare la data stabilită, pacientul va fi contactat telefonic sau
						prin email pentru reprogramare.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">4. Programul de Funcționare</h2>
					<p>Consultațiile se desfășoară în următorul program:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li><strong>Luni – Vineri:</strong> 09:00 – 18:00</li>
						<li><strong>Sâmbătă:</strong> Pe programare</li>
						<li><strong>Duminică și sărbători legale:</strong> Închis</li>
					</ul>
					<p class="mt-3">
						Programările online pot fi efectuate oricând (24/7), dar vor fi confirmate și onorate
						doar în intervalele de funcționare de mai sus.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">5. Contact pentru Probleme</h2>
					<p>
						Pentru orice nelămurire legată de programare sau confirmare, ne puteți contacta:
					</p>
					<p class="mt-2">
						<strong>Telefon:</strong> 0711 039 666<br />
						<strong>Email:</strong> office@psimed.ro<br />
						<strong>Program telefonic:</strong> Luni – Vineri, 09:00 – 18:00
					</p>
				</section>

				<div class="pt-6 border-t border-gray-200">
					<p class="text-sm text-gray-500">Ultima actualizare: Februarie 2026</p>
				</div>
			</div>

			<div class="mt-8 text-center">
				<Button href="/" variant="secondary">Înapoi la pagina principală</Button>
			</div>
		</div>
	</div>
</section>
