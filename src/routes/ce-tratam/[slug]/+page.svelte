<script lang="ts">
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	import ProblemTemplate from '$lib/components/templates/ProblemTemplate.svelte';
	import { getProblemBySlug } from '$lib/data/problems';

	const slug = $page.params.slug;
	const problem = getProblemBySlug(slug);

	if (!problem) {
		error(404, {
			message: 'Pagina nu a fost găsită'
		});
	}
</script>

{#if problem}
	<ProblemTemplate
		title={problem.title}
		subtitle={problem.subtitle}
		category={problem.category}
		heroDescription={problem.heroDescription}
		symptoms={problem.symptoms}
		whenToSeekHelp={problem.whenToSeekHelp}
		treatments={problem.treatments}
		specialists={problem.specialists}
		relatedProblems={problem.relatedProblems}
		specialtyParam={problem.specialtyParam}
	/>
{/if}
