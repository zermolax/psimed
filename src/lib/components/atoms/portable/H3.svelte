<script lang="ts">
	let { children }: { children: unknown } = $props();
</script>

<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">
	{@render (children as () => unknown)()}
</h3>
