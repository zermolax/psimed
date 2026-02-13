<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../atoms/Button.svelte';
	import Icon from '../atoms/Icon.svelte';

	let mobileMenuOpen = $state(false);

	const navigation = [
		{ name: 'Acasă', href: '/' },
		{
			name: 'Ce Tratăm',
			href: '/ce-tratam',
			children: [
				{ name: 'Pentru Copii', href: '/ce-tratam#copii', isHeader: true },
				{ name: 'Autism / TSA', href: '/ce-tratam/autism-tsa' },
				{ name: 'ADHD', href: '/ce-tratam/adhd' },
				{ name: 'Anxietate la Copii', href: '/ce-tratam/anxietate-copii' },
				{ name: 'Întârzieri în Dezvoltare', href: '/ce-tratam/intarzieri-dezvoltare' },
				{ name: 'Pentru Adulți', href: '/ce-tratam#adulti', isHeader: true },
				{ name: 'Depresie', href: '/ce-tratam/depresie' },
				{ name: 'Anxietate', href: '/ce-tratam/anxietate' },
				{ name: 'Tulburări de Somn', href: '/ce-tratam/tulburari-somn' },
				{ name: 'Stres și Burnout', href: '/ce-tratam/stres-burnout' }
			]
		},
		{ name: 'Specialiști', href: '/specialisti' },
		{ name: 'Servicii & Prețuri', href: '/servicii-si-preturi' },
		{ name: 'Despre Noi', href: '/despre-noi' },
		{ name: 'Contact', href: '/contact' }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 bg-white shadow-sm z-50 transition-shadow duration-300">
	<div class="container-custom">
		<div class="flex justify-between items-center py-4">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
				<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
					<Icon name="heart" size="24" class="text-white" />
				</div>
				<div class="flex flex-col">
					<span class="text-xl font-bold text-gray-900">Clinica Sf. Gherasim</span>
					<span class="text-xs text-gray-600">PSIMED</span>
				</div>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden lg:flex items-center space-x-8">
				{#each navigation as item}
					{#if item.children}
						<div class="relative group">
							<a
								href={item.href}
								class="text-gray-700 hover:text-primary transition-colors font-medium"
								class:text-primary={$page.url.pathname.startsWith(item.href)}
							>
								{item.name}
							</a>
							<!-- Dropdown -->
							<div
								class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100"
							>
								<div class="py-2">
									{#each item.children as child}
										{#if child.isHeader}
											<div class="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 mt-2 first:mt-0">
												{child.name}
											</div>
										{:else}
											<a
												href={child.href}
												class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
												onclick={() => {}}
											>
												{child.name}
											</a>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<a
							href={item.href}
							class="text-gray-700 hover:text-primary transition-colors font-medium"
							class:text-primary={$page.url.pathname === item.href}
						>
							{item.name}
						</a>
					{/if}
				{/each}
			</nav>

			<!-- CTA Button + Mobile Menu Toggle -->
			<div class="flex items-center space-x-4">
				<Button href="/programare" variant="primary" size="md" class="hidden sm:inline-block">
					PROGRAMEAZĂ-TE
				</Button>

				<!-- Mobile Menu Button -->
				<button
					class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
					onclick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<Icon name="close" size="24" class="text-gray-700" />
					{:else}
						<Icon name="menu" size="24" class="text-gray-700" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="lg:hidden border-t border-gray-200 bg-white">
			<nav class="container-custom py-4 space-y-2">
				{#each navigation as item}
					{#if item.children}
						<div class="space-y-1">
							<a
								href={item.href}
								class="block px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg"
								onclick={closeMobileMenu}
							>
								{item.name}
							</a>
							<div class="pl-4 space-y-1">
								{#each item.children as child}
									{#if child.isHeader}
										<div class="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
											{child.name}
										</div>
									{:else}
										<a
											href={child.href}
											class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
											onclick={closeMobileMenu}
										>
											{child.name}
										</a>
									{/if}
								{/each}
							</div>
						</div>
					{:else}
						<a
							href={item.href}
							class="block px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg"
							onclick={closeMobileMenu}
						>
							{item.name}
						</a>
					{/if}
				{/each}

				<!-- Mobile CTA -->
				<div class="pt-4">
					<Button href="/programare" variant="primary" size="lg" class="w-full">
						PROGRAMEAZĂ-TE
					</Button>
				</div>
			</nav>
		</div>
	{/if}
</header>
