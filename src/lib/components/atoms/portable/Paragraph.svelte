<script lang="ts">
	let { children }: { children: unknown } = $props();
</script>

<p>{@render (children as () => unknown)()}</p>
