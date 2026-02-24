<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<svelte:head>
	<title>Politica de Anulare - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Politica de anulare și rambursare a programărilor la Clinica Sf. Gherasim - PSIMED din Bacău."
	/>
</svelte:head>

<section class="py-16 bg-gray-50">
	<div class="container-custom">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-4xl font-black text-gray-900 mb-8">Politica de Anulare</h1>

			<div class="bg-white rounded-xl p-8 shadow-sm space-y-6 text-gray-700">
				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">1. Dreptul de Retragere</h2>
					<p>
						Conform <strong>OUG nr. 34/2014</strong> privind drepturile consumatorilor în cadrul
						contractelor încheiate cu profesioniștii, serviciile medicale prestate la o dată și oră
						specifică fac obiectul excepțiilor de la dreptul de retragere de 14 zile (art. 16, lit.
						l), dacă prestarea serviciului a început cu acordul expres al consumatorului înainte de
						expirarea acestui termen.
					</p>
					<p class="mt-3">
						Prin efectuarea programării și confirmarea plății, pacientul acordă consimțământul expres
						pentru prestarea serviciului la data aleasă. Cu toate acestea, PSI-MIND S.R.L. oferă
						posibilitatea de anulare în condițiile descrise mai jos.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">
						2. Anularea cu Minim 24 de Ore Înainte
					</h2>
					<p>
						Dacă pacientul anulează programarea cu <strong>cel puțin 24 de ore înainte</strong> de
						data și ora consultației:
					</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>Pacientul are dreptul la o <strong>reprogramare gratuită</strong> la o altă dată disponibilă</li>
						<li>
							La solicitarea expresă, se poate procesa o <strong>rambursare integrală</strong> a sumei
							achitate
						</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">
						3. Anularea cu Mai Puțin de 24 de Ore Înainte
					</h2>
					<p>
						În cazul anulărilor efectuate cu <strong>mai puțin de 24 de ore</strong> înainte de
						consultație sau al neprezentării (no-show):
					</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>
							Se poate reține o taxă de anulare de până la <strong>50% din valoarea serviciului</strong
							>, pentru a acoperi costurile de rezervare a slotului orar
						</li>
						<li>
							Fiecare situație va fi analizată individual, luând în considerare circumstanțele
							prezentate
						</li>
						<li>
							Urgențele medicale documentate sunt tratate cu înțelegere — contactați-ne imediat
						</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">4. Procesul de Rambursare</h2>
					<p>Rambursările aprobate sunt procesate astfel:</p>
					<ul class="list-disc pl-6 mt-2 space-y-1">
						<li>
							Suma se returnează prin același mijloc de plată utilizat (card bancar prin Netopia
							mobilPay)
						</li>
						<li>
							Termenul de procesare este de <strong>5–10 zile lucrătoare</strong> de la aprobarea
							cererii de rambursare
						</li>
						<li>
							PSI-MIND S.R.L. nu percep comisioane suplimentare pentru rambursări — costurile de
							transfer sunt suportate de clinică
						</li>
					</ul>
				</section>

				<section>
					<h2 class="text-xl font-bold text-gray-900 mb-3">5. Cum Anulezi o Programare</h2>
					<p>
						Pentru a anula o programare, contactați-ne prin oricare dintre metodele de mai jos,
						menționând <strong>data consultației, ora și numele pacientului</strong>:
					</p>
					<p class="mt-2">
						<strong>Telefon:</strong> 0711 039 666<br />
						<strong>Email:</strong> office@psimed.ro<br />
						<strong>Program:</strong> Luni – Vineri, 09:00 – 18:00
					</p>
					<p class="mt-3 text-sm text-gray-500">
						Vă rugăm să ne contactați cât mai devreme posibil pentru a permite altor pacienți să
						beneficieze de slotul eliberat.
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
