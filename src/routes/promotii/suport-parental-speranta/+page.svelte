<script lang="ts">
	import PromotionLanding, {
		type PromotionData
	} from '$lib/components/templates/PromotionLanding.svelte';

	const data: PromotionData = {
		locale: 'ro',
		altLanguages: [
			{ locale: 'en', url: '/promotii/parental-support-hope', label: 'English' },
			{ locale: 'it', url: '/promotii/supporto-genitori-speranza', label: 'Italiano' }
		],
		title:
			'Nu ești singur în această călătorie. Suntem alături de tine — și de copilul tău — la fiecare pas.',
		intro:
			'Știm că drumul spre un diagnostic poate fi lung și emoționant. La <strong>Clinica Sf. Gherasim</strong>, nu tratăm doar copilul — sprijinim întreaga familie. De la prima consultație până la planul de intervenție, vei avea alături o echipă care ascultă, explică și ghidează.',
		bullets: [
			{
				iconName: 'heart',
				label: 'Sesiuni de suport pentru părinți',
				description: ' — orientare practică, răspunsuri clare, mai puțin necunoscut'
			},
			{
				iconName: 'check',
				label: 'Plan personalizat de intervenție timpurie',
				description: ' — pași concreți adaptați nevoilor unice ale copilului tău'
			},
			{
				iconName: 'brain',
				label: 'Evaluare cu',
				description:
					' <strong>ADOS, ADI-R, WISC</strong> + consult psihiatric pediatric — diagnostic complet, nu parțial'
			},
			{
				iconName: 'user',
				label: 'Echipă multidisciplinară',
				description:
					': psihologi, logopezi și terapeuți ABA lucrează împreună pentru copilul tău'
			},
			{
				iconName: 'calendar',
				label: 'Cazare facilitată',
				description: ' pentru familiile care vin din alte localități sau din străinătate'
			}
		],
		closing:
			'Intervenția timpurie face o diferență reală. Să știi că ai luat decizia potrivită pentru copilul tău — asta nu are preț.',
		ctaText: 'Hai să vorbim — programează acum',
		ctaSubtext: 'Consultație online sau la clinică · Răspuns în 24h',
		ctaHref: '/programare',
		hashtags: [
			'ParintiTSA',
			'SuportParinti',
			'IntervenrieTimpurie',
			'DiagnosticTSARomania',
			'ClinicaSfGherasim',
			'ADOSBacau'
		],
		disclaimer:
			'Nicio promisiune de vindecare. Accent pe suport familial și intervenție timpurie. Recomandăm validarea finală cu un specialist în publicitate medicală înainte de publicare.',
		seoTitle:
			'Suport Parental & Speranță — Diagnostic și intervenție timpurie TSA · Clinica Sf. Gherasim Bacău',
		seoDescription:
			'Suport pentru părinți, evaluare ADOS/ADI-R/WISC, plan de intervenție timpurie pentru autism. Echipă multidisciplinară la Clinica Sf. Gherasim, Bacău.',
		seoKeywords: [
			'diagnostic TSA România',
			'ADOS Bacău',
			'intervenție timpurie autism',
			'evaluare ADOS ADI-R',
			'suport părinți autism',
			'Clinica Sf. Gherasim'
		]
	};
</script>

<PromotionLanding {data} />
