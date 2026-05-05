<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	let { data } = $props();
	const posts = data.posts;

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('ro-RO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog - Clinica Sf. Gherasim</title>
	<meta
		name="description"
		content="Articole despre sănătate mentală, psihiatrie și psihologie de la specialiștii Clinicii Sf. Gherasim din Bacău."
	/>
</svelte:head>

<section class="bg-gradient-to-br from-primary-light to-white py-16 md:py-20">
	<div class="container-custom">
		<div class="max-w-3xl">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Blog</h1>
			<p class="text-xl text-gray-700 leading-relaxed">
				Articole, ghiduri și informații utile despre sănătatea mentală — scrise de specialiștii noștri.
			</p>
		</div>
	</div>
</section>

<section class="py-16 bg-white">
	<div class="container-custom">
		{#if posts.length === 0}
			<div class="max-w-2xl mx-auto text-center py-12">
				<p class="text-lg text-gray-600 mb-6">
					Nu am publicat încă niciun articol. Reveniți curând — pregătim primele materiale.
				</p>
				<Button href="/" variant="secondary">Înapoi la pagina principală</Button>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{#each posts as post}
					<a
						href="/blog/{post.slug}"
						class="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
					>
						{#if post.coverUrl}
							<div class="aspect-video overflow-hidden bg-gray-100">
								<img
									src={post.coverUrl}
									alt={post.title}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>
						{/if}
						<div class="p-6 flex-1 flex flex-col">
							<time class="text-sm text-gray-500 mb-2">{formatDate(post.publishedAt)}</time>
							<h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
								{post.title}
							</h2>
							{#if post.excerpt}
								<p class="text-gray-600 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
							{/if}
							{#if post.author}
								<p class="text-sm text-gray-500 mt-auto">de {post.author.name}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
