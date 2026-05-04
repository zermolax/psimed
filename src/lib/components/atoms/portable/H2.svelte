<script lang="ts">
	let { children }: { children: unknown } = $props();
</script>

<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">
	{@render (children as () => unknown)()}
</h2>
