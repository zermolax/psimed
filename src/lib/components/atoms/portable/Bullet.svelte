<script lang="ts">
	let { children }: { children: unknown } = $props();
</script>

<ul class="list-disc pl-6 space-y-1">
	{@render (children as () => unknown)()}
</ul>
