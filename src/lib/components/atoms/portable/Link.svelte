<script lang="ts">
	let { children, value }: { children: unknown; value: { href?: string } } = $props();
</script>

<a
	href={value?.href ?? '#'}
	class="text-primary hover:underline"
	target={value?.href?.startsWith('http') ? '_blank' : undefined}
	rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
>
	{@render (children as () => unknown)()}
</a>
