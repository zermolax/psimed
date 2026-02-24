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

	const legalLinks = [
		{ name: 'Termeni și Condiții', href: '/termeni-si-conditii' },
		{ name: 'Confidențialitate', href: '/politica-confidentialitate' },
		{ name: 'Politica de Anulare', href: '/politica-de-anulare' },
		{ name: 'Politica de Livrare', href: '/politica-de-livrare' }
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
				<!-- Company registration info — required for Netopia enrollment -->
				<div class="text-xs text-gray-500 space-y-0.5 pt-3 border-t border-gray-800">
					<p class="font-medium text-gray-400">PSI-MIND S.R.L.</p>
					<p>CUI: 44289726</p>
					<p>Jud. Bacău, Sat Schineni, Com. Săucești</p>
					<p>Str. Mare nr. 189</p>
				</div>
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
		<div class="mt-12 pt-8 border-t border-gray-800 space-y-4">
			<!-- Legal links -->
			<div class="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start">
				{#each legalLinks as link}
					<a href={link.href} class="text-xs text-gray-500 hover:text-primary transition-colors">
						{link.name}
					</a>
				{/each}
				<a href="/contact" class="text-xs text-gray-500 hover:text-primary transition-colors">
					Contact
				</a>
				<a href="/programare" class="text-xs text-gray-500 hover:text-primary transition-colors">
					Programare
				</a>
			</div>

			<!-- Copyright + NETOPIA logo -->
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-sm text-gray-400">
					© {currentYear} Clinica Sf. Gherasim - PSIMED. Toate drepturile rezervate.
				</p>
				<!-- NETOPIA logo: download from Netopia dashboard → Identitate Vizuală → save as static/netopia-logo.png -->
				<img
					src="/netopia-logo.png"
					alt="Plată securizată Netopia mobilPay"
					class="h-7 opacity-60 hover:opacity-90 transition-opacity"
					onerror="this.style.display='none'"
				/>
			</div>

			<!-- ANPC SAL/ADR — required by Romanian law for online commerce -->
			<p class="text-xs text-gray-600 text-center md:text-left">
				Soluționarea alternativă a litigiilor:
				<a
					href="https://anpc.ro/ce-este-sal/"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-gray-400 transition-colors underline">ANPC</a
				>
				·
				<a
					href="https://ec.europa.eu/consumers/odr"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-gray-400 transition-colors underline">Platforma ODR</a
				>
			</p>
		</div>
	</div>
</footer>
