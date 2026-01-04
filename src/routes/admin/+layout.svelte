<script lang="ts">
  /**
   * EXPLANATION: Layout Component
   *
   * +layout.svelte is the wrapper for all pages under /admin/...
   * It renders for every admin page.
   *
   * <slot /> is where child pages render.
   * In Svelte, this is like the {children} in React.
   */
</script>

<div class="min-h-screen bg-gray-50">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
