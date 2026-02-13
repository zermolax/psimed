<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	interface Props {
		name: string;
		title: string;
		specialties: string[];
		description: string;
		image?: string;
		bookingParam?: string;
	}

	let { name, title, specialties, description, image, bookingParam }: Props = $props();

	const bookingUrl = bookingParam ? `/programare?doctor=${bookingParam}` : '/programare';
	const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dd4444&color=fff&size=200&font-size=0.35`;
</script>

<div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
	<!-- Image -->
	<div class="relative h-64 bg-gradient-to-br from-primary-light to-secondary-light overflow-hidden">
		<img
			src={image || placeholderImage}
			alt={name}
			class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
	</div>

	<!-- Content -->
	<div class="p-6">
		<h3 class="text-xl font-bold text-gray-900 mb-1">{name}</h3>
		<p class="text-primary font-medium text-sm mb-3">{title}</p>

		<!-- Specialties -->
		<div class="flex flex-wrap gap-2 mb-4">
			{#each specialties as specialty}
				<span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
					{specialty}
				</span>
			{/each}
		</div>

		<p class="text-gray-600 text-sm mb-6 line-clamp-3">
			{description}
		</p>

		<Button href={bookingUrl} variant="primary" size="sm" class="w-full">
			Programează consultație
		</Button>
	</div>
</div>
