<script lang="ts">
	import PromotionLanding, {
		type PromotionData
	} from '$lib/components/templates/PromotionLanding.svelte';

	const data: PromotionData = {
		locale: 'it',
		altLanguages: [
			{ locale: 'ro', url: '/promotii/suport-parental-speranta', label: 'Română' },
			{ locale: 'en', url: '/promotii/parental-support-hope', label: 'English' }
		],
		title:
			'Non sei solo in questo percorso. Siamo al tuo fianco — e a quello di tuo figlio — ad ogni passo.',
		intro:
			"Sappiamo che il cammino verso una diagnosi può essere lungo e carico di emozioni. Alla <strong>Clinica Sf. Gherasim</strong>, non valutiamo solo il bambino — sosteniamo l'intera famiglia. Dal primo appuntamento al piano di intervento, avrai accanto un'équipe che ascolta, spiega e accompagna.",
		bullets: [
			{
				iconName: 'heart',
				label: 'Sessioni di supporto per i genitori',
				description: ' — orientamento pratico, risposte chiare, meno incertezza'
			},
			{
				iconName: 'check',
				label: 'Piano di intervento precoce personalizzato',
				description: ' — passi concreti adattati ai bisogni unici di tuo figlio'
			},
			{
				iconName: 'brain',
				label: 'Valutazione con',
				description:
					' <strong>ADOS, ADI-R, WISC</strong> + consulto psichiatrico pediatrico — diagnosi completa, non parziale'
			},
			{
				iconName: 'user',
				label: 'Équipe multidisciplinare',
				description:
					': psicologi, logopedisti e terapisti ABA che lavorano insieme per tuo figlio'
			},
			{
				iconName: 'calendar',
				label: 'Sistemazione organizzata',
				description: " per le famiglie che arrivano da altre città o dall'estero"
			}
		],
		closing:
			"L'intervento precoce fa una differenza reale. Sapere di aver preso la decisione giusta per tuo figlio — questo non ha prezzo.",
		ctaText: 'Parliamone — prenota subito',
		ctaSubtext: 'Consulenza online o di persona · Risposta entro 24h',
		ctaHref: '/programare',
		hashtags: [
			'GenitoriAutismo',
			'SupportoGenitori',
			'InterventoPrecoce',
			'DiagnosiAutismoRomania',
			'ClinicaSfGherasim',
			'ADOSBacau'
		],
		disclaimer:
			'Nessuna promessa di guarigione. Focus sul supporto familiare e intervento precoce. Consigliamo la validazione finale da parte di uno specialista in pubblicità medica prima della pubblicazione.',
		seoTitle:
			'Supporto Genitori & Speranza — Diagnosi e intervento precoce autismo · Clinica Sf. Gherasim Romania',
		seoDescription:
			"Supporto ai genitori, valutazione ADOS/ADI-R/WISC, piano di intervento precoce per l'autismo. Équipe multidisciplinare alla Clinica Sf. Gherasim, Bacău, Romania.",
		seoKeywords: [
			'diagnosi autismo Romania',
			'ADOS Bacau',
			'intervento precoce autismo',
			'valutazione ADOS ADI-R',
			'supporto genitori autismo',
			'Clinica Sf. Gherasim'
		]
	};
</script>

<PromotionLanding {data} />
