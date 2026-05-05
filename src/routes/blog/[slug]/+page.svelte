<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import PortableBody from '$lib/components/atoms/PortableBody.svelte';

	let { data } = $props();
	const post = data.post;

	const seoTitle = post?.seoTitle ?? post?.title ?? '';
	const seoDescription = post?.seoDescription ?? post?.excerpt ?? '';

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('ro-RO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{seoTitle} - Clinica Sf. Gherasim</title>
	{#if seoDescription}
		<meta name="description" content={seoDescription} />
		<meta property="og:description" content={seoDescription} />
	{/if}
	<meta property="og:title" content={seoTitle} />
	<meta property="og:type" content="article" />
	{#if post?.coverUrl}
		<meta property="og:image" content={post.coverUrl} />
	{/if}
</svelte:head>

{#if post}
	<article>
		{#if post.coverUrl}
			<div class="aspect-video md:aspect-[21/9] bg-gray-100 overflow-hidden">
				<img src={post.coverUrl} alt={post.title} class="w-full h-full object-cover" />
			</div>
		{/if}

		<header class="bg-white py-12">
			<div class="container-custom max-w-3xl">
				<div class="flex items-center gap-3 text-sm text-gray-500 mb-4">
					<time>{formatDate(post.publishedAt)}</time>
					{#if post.author}
						<span>·</span>
						<span>de <strong class="text-gray-700">{post.author.name}</strong></span>
					{/if}
				</div>
				<h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
					{post.title}
				</h1>
				{#if post.excerpt}
					<p class="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
				{/if}
			</div>
		</header>

		{#if post.body && post.body.length > 0}
			<section class="py-8 bg-white">
				<div class="container-custom max-w-3xl">
					<PortableBody value={post.body} />
				</div>
			</section>
		{/if}

		{#if post.author}
			<section class="py-12 bg-gray-50 border-t border-gray-200">
				<div class="container-custom max-w-3xl">
					<div class="flex items-center gap-4">
						{#if post.author.image}
							<img
								src={post.author.image}
								alt={post.author.name}
								class="w-16 h-16 rounded-full object-cover"
							/>
						{/if}
						<div>
							<p class="text-sm text-gray-500">Articol scris de</p>
							<p class="text-lg font-bold text-gray-900">{post.author.name}</p>
							{#if post.author.title}
								<p class="text-sm text-gray-600">{post.author.title}</p>
							{/if}
						</div>
					</div>
				</div>
			</section>
		{/if}

		<section class="py-8 bg-white text-center">
			<Button href="/blog" variant="secondary">← Înapoi la toate articolele</Button>
		</section>
	</article>
{/if}
