<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Category = 'copii' | 'adulti';

	interface Props {
		title: string;
		description: string;
		href: string;
		icon?: string;
		category: Category;
	}

	let { title, description, href, icon = 'brain', category }: Props = $props();

	const categoryStyles: Record<Category, { bg: string; border: string; badge: string; badgeText: string }> = {
		copii: {
			bg: 'bg-secondary-light hover:bg-secondary-light/80',
			border: 'border-secondary/20 hover:border-secondary/40',
			badge: 'bg-secondary',
			badgeText: 'Pentru copii'
		},
		adulti: {
			bg: 'bg-primary-light hover:bg-primary-light/80',
			border: 'border-primary/20 hover:border-primary/40',
			badge: 'bg-primary',
			badgeText: 'Pentru adulți'
		}
	};

	const styles = categoryStyles[category];
</script>

<a
	{href}
	class="block group rounded-2xl border-2 {styles.bg} {styles.border} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
>
	<div class="flex items-start gap-4">
		<div class="flex-shrink-0 w-12 h-12 rounded-xl {styles.badge} flex items-center justify-center text-white shadow-md">
			<Icon name={icon} size={24} />
		</div>

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-2">
				<h3 class="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
					{title}
				</h3>
			</div>

			<p class="text-gray-600 text-sm line-clamp-2">
				{description}
			</p>

			<div class="mt-3 flex items-center justify-between">
				<span class="text-xs font-medium {styles.badge} text-white px-2 py-1 rounded-full">
					{styles.badgeText}
				</span>
				<span class="text-sm font-medium text-gray-500 group-hover:text-gray-700 flex items-center gap-1 transition-colors">
					Află mai mult
					<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</span>
			</div>
		</div>
	</div>
</a>
