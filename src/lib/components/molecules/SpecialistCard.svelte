<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	type Category = 'psihiatru' | 'psiholog' | 'terapeut' | 'alt-specialist';

	interface Props {
		name: string;
		title: string;
		specialties: string[];
		description: string;
		image?: string;
		bookingParam?: string;
		category?: Category;
	}

	let { name, title, specialties, description, image, bookingParam, category }: Props = $props();

	const bookingUrl = bookingParam ? `/programare?doctor=${bookingParam}` : '/programare';
	const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dd4444&color=fff&size=200&font-size=0.35`;

	const categoryConfig: Record<Category, { label: string; bgClass: string; borderClass: string }> = {
		psihiatru: {
			label: 'Psihiatru',
			bgClass: 'bg-primary',
			borderClass: 'border-l-primary'
		},
		psiholog: {
			label: 'Psiholog',
			bgClass: 'bg-secondary',
			borderClass: 'border-l-secondary'
		},
		terapeut: {
			label: 'Psihoterapeut',
			bgClass: 'bg-accent',
			borderClass: 'border-l-accent'
		},
		'alt-specialist': {
			label: 'Specialist',
			bgClass: 'bg-nature',
			borderClass: 'border-l-nature'
		}
	};

	const config = category ? categoryConfig[category] : null;
</script>

<div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group {config ? `border-l-4 ${config.borderClass}` : ''}">
	<!-- Image -->
	<div class="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
		<img
			src={image || placeholderImage}
			alt={name}
			class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

		<!-- Category Badge -->
		{#if config}
			<div class="absolute top-3 left-3">
				<span class="{config.bgClass} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
					{config.label}
				</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-5">
		<h3 class="text-lg font-bold text-gray-900 mb-1">{name}</h3>
		<p class="text-primary font-medium text-sm mb-3">{title}</p>

		<!-- Specialties -->
		<div class="flex flex-wrap gap-1.5 mb-3">
			{#each specialties.slice(0, 3) as specialty}
				<span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
					{specialty}
				</span>
			{/each}
			{#if specialties.length > 3}
				<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
					+{specialties.length - 3}
				</span>
			{/if}
		</div>

		<p class="text-gray-600 text-sm mb-4 line-clamp-2">
			{description}
		</p>

		<Button href={bookingUrl} variant="primary" size="sm" class="w-full">
			Programează consultație
		</Button>
	</div>
</div>
