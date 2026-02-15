<script lang="ts">
	import ProblemTemplate from '$lib/components/templates/ProblemTemplate.svelte';

	let { data } = $props();
</script>

{#if data.problem}
	<ProblemTemplate
		title={data.problem.title}
		subtitle={data.problem.subtitle}
		category={data.problem.category}
		heroDescription={data.problem.heroDescription}
		symptoms={data.problem.symptoms}
		whenToSeekHelp={data.problem.whenToSeekHelp}
		treatments={data.problem.treatments}
		specialists={data.problem.specialists}
		relatedProblems={data.problem.relatedProblems}
		specialtyParam={data.problem.specialtyParam}
	/>
{/if}
