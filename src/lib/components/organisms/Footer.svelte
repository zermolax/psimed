<script lang="ts">
	import Icon from '../atoms/Icon.svelte';

	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Ce Tratăm', href: '/ce-tratam' },
		{ name: 'Specialiști', href: '/specialisti' },
		{ name: 'Servicii & Prețuri', href: '/servicii-si-preturi' },
		{ name: 'Despre Noi', href: '/despre-noi' },
		{ name: 'Contact', href: '/contact' }
	];

	const services = [
		{ name: 'Psihiatrie Adulți', href: '/ce-tratam#adulti' },
		{ name: 'Psihiatrie Copii', href: '/ce-tratam#copii' },
		{ name: 'Programare Online', href: '/programare' }
	];

	const contactInfo = [
		{ icon: 'phone', text: '0711 039 666', href: 'tel:+40711039666' },
		{ icon: 'email', text: 'office@psimed.ro', href: 'mailto:office@psimed.ro' }
	];
</script>

<footer class="bg-gray-900 text-gray-300">
	<div class="container-custom py-12 md:py-16">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
			<!-- About Section -->
			<div class="space-y-4">
				<div class="flex items-center space-x-2">
					<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
						<Icon name="heart" size="24" class="text-white" />
					</div>
					<div class="flex flex-col">
						<span class="text-lg font-bold text-white">Clinica Sf. Gherasim</span>
						<span class="text-xs text-gray-400">PSIMED</span>
					</div>
				</div>
				<p class="text-sm leading-relaxed">
					Îngrijire psihiatrică și psihologică de încredere în Bacău. Oferim tratamente moderne și
					personalizate pentru sănătatea ta mentală.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-white font-semibold mb-4">Link-uri Rapide</h3>
				<ul class="space-y-2">
					{#each quickLinks as link}
						<li>
							<a href={link.href} class="text-sm hover:text-primary transition-colors">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Services -->
			<div>
				<h3 class="text-white font-semibold mb-4">Servicii</h3>
				<ul class="space-y-2">
					{#each services as service}
						<li>
							<a href={service.href} class="text-sm hover:text-primary transition-colors">
								{service.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact Info -->
			<div>
				<h3 class="text-white font-semibold mb-4">Contact</h3>
				<ul class="space-y-3">
					{#each contactInfo as contact}
						<li>
							<a
								href={contact.href}
								class="flex items-center space-x-2 text-sm hover:text-primary transition-colors group"
							>
								<Icon
									name={contact.icon}
									size="20"
									class="text-gray-400 group-hover:text-primary transition-colors"
								/>
								<span>{contact.text}</span>
							</a>
						</li>
					{/each}
				</ul>

				<div class="mt-6">
					<h4 class="text-sm font-medium text-white mb-2">Program</h4>
					<p class="text-sm">Luni - Vineri: 09:00 - 18:00</p>
					<p class="text-sm">Sâmbătă: Pe programare</p>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="mt-12 pt-8 border-t border-gray-800">
			<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<p class="text-sm text-gray-400">
					© {currentYear} Clinica Sf. Gherasim - PSIMED. Toate drepturile rezervate.
				</p>

				<div class="flex space-x-6">
					<a href="/contact" class="text-sm hover:text-primary transition-colors">
						Contact
					</a>
					<a href="/programare" class="text-sm hover:text-primary transition-colors">
						Programare
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>
