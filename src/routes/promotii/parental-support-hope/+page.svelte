<script lang="ts">
	import PromotionLanding, {
		type PromotionData
	} from '$lib/components/templates/PromotionLanding.svelte';

	const data: PromotionData = {
		locale: 'en',
		altLanguages: [
			{ locale: 'ro', url: '/promotii/suport-parental-speranta', label: 'Română' },
			{ locale: 'it', url: '/promotii/supporto-genitori-speranza', label: 'Italiano' }
		],
		title:
			'You are not alone in this journey. We walk alongside you — and your child — every step of the way.',
		intro:
			"We know the path to a diagnosis can feel long and overwhelming. At <strong>Clinica Sf. Gherasim</strong>, we don't just assess the child — we support the whole family. From the first appointment to the intervention plan, you'll have a team that listens, explains, and guides.",
		bullets: [
			{
				iconName: 'heart',
				label: 'Parent support sessions',
				description: ' — practical guidance, clear answers, less uncertainty'
			},
			{
				iconName: 'check',
				label: 'Personalised early intervention plan',
				description: " — concrete steps tailored to your child's unique needs"
			},
			{
				iconName: 'brain',
				label: 'Evaluation using',
				description:
					' <strong>ADOS, ADI-R, WISC</strong> + integrated paediatric psychiatric consult — complete, not partial'
			},
			{
				iconName: 'user',
				label: 'Multidisciplinary team',
				description:
					': psychologists, speech therapists and ABA therapists working together for your child'
			},
			{
				iconName: 'calendar',
				label: 'Accommodation arranged',
				description: ' for families travelling from other cities or from abroad'
			}
		],
		closing:
			'Early intervention makes a real difference. Knowing you made the right decision for your child — that is priceless.',
		ctaText: "Let's talk — book your appointment",
		ctaSubtext: 'Online or in-person consultation · Reply within 24h',
		ctaHref: '/programare',
		hashtags: [
			'AutismParents',
			'ParentSupport',
			'EarlyIntervention',
			'ASDDiagnosisRomania',
			'ClinicaSfGherasim',
			'ADOSBacau'
		],
		disclaimer:
			'No promise of cure. Focus on family support and early intervention. We recommend final validation by a medical advertising specialist before publication.',
		seoTitle:
			'Parental Support & Hope — Early autism diagnosis and intervention · Clinica Sf. Gherasim Romania',
		seoDescription:
			'Parent support, ADOS/ADI-R/WISC evaluation, early intervention plan for autism. Multidisciplinary team at Clinica Sf. Gherasim, Bacău, Romania.',
		seoKeywords: [
			'autism diagnosis Romania',
			'ADOS Bacau',
			'early autism intervention',
			'ADOS ADI-R evaluation',
			'autism parent support',
			'Clinica Sf. Gherasim'
		]
	};
</script>

<PromotionLanding {data} />
