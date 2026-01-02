<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../atoms/Button.svelte';
	import Icon from '../atoms/Icon.svelte';

	let mobileMenuOpen = $state(false);

	const navigation = [
		{
			name: 'Servicii',
			href: '/servicii',
			children: [
				{ name: 'Psihiatrie Adulți', href: '/servicii#psihiatrie-adulti' },
				{ name: 'Psihiatrie Pediatrică', href: '/servicii#psihiatrie-pediatrica' },
				{ name: 'Psihologie Clinică', href: '/servicii#psihologie-clinica' },
				{ name: 'Psihoterapie', href: '/servicii#psihoterapie' },
				{ name: 'Terapii Complementare', href: '/servicii#terapii-complementare' }
			]
		},
		{ name: 'Tratamente', href: '/tratamente' },
		{ name: 'Despre Noi', href: '/despre-noi' },
		{ name: 'Blog', href: '/blog' },
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
								class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
							>
								<div class="py-2">
									{#each item.children as child}
										<a
											href={child.href}
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
										>
											{child.name}
										</a>
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
									<a
										href={child.href}
										class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
										onclick={closeMobileMenu}
									>
										{child.name}
									</a>
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
