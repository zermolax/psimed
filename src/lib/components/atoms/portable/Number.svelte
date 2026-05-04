<script lang="ts">
	let { children }: { children: unknown } = $props();
</script>

<ol class="list-decimal pl-6 space-y-1">
	{@render (children as () => unknown)()}
</ol>
