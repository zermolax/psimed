<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	interface PriceItem {
		name: string;
		description?: string;
		price: number;
		duration?: number;
		category: string;
	}

	interface Props {
		items: PriceItem[];
		title?: string;
	}

	let { items, title }: Props = $props();

	// Group items by category
	let groupedItems = $derived.by(() => {
		const groups: Record<string, PriceItem[]> = {};
		for (const item of items) {
			if (!groups[item.category]) {
				groups[item.category] = [];
			}
			groups[item.category].push(item);
		}
		return groups;
	});

	const categoryColors: Record<string, string> = {
		'Consultații': 'bg-primary',
		'Evaluări Psihologice': 'bg-secondary',
		'Psihoterapie': 'bg-accent',
		'Tratamente': 'bg-nature',
		'Alte Servicii': 'bg-gray-600'
	};

	function getCategoryColor(category: string): string {
		return categoryColors[category] || 'bg-gray-600';
	}
</script>

<div class="space-y-8">
	{#each Object.entries(groupedItems) as [category, categoryItems]}
		<div class="bg-white rounded-2xl shadow-lg overflow-hidden">
			<!-- Category Header -->
			<div class="{getCategoryColor(category)} px-6 py-4">
				<h3 class="text-xl font-bold text-white">{category}</h3>
			</div>

			<!-- Price Table -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serviciu</th>
							<th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 hidden sm:table-cell">Durată</th>
							<th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">Preț</th>
							<th class="px-6 py-4 text-right text-sm font-semibold text-gray-900 hidden md:table-cell"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#each categoryItems as item}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<div class="font-medium text-gray-900">{item.name}</div>
									{#if item.description}
										<div class="text-sm text-gray-500 mt-1">{item.description}</div>
									{/if}
								</td>
								<td class="px-6 py-4 text-center text-gray-600 hidden sm:table-cell">
									{#if item.duration}
										{item.duration} min
									{:else}
										-
									{/if}
								</td>
								<td class="px-6 py-4 text-right">
									<span class="text-lg font-bold text-gray-900">{item.price}</span>
									<span class="text-gray-500 text-sm"> RON</span>
								</td>
								<td class="px-6 py-4 text-right hidden md:table-cell">
									<a
										href="/programare"
										class="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-medium text-sm rounded-lg hover:bg-primary hover:text-white transition-colors"
									>
										Programează
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/each}
</div>
