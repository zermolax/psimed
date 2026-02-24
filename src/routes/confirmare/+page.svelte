<script lang="ts">
	import { page } from '$app/stores';

	const orderId = $derived($page.url.searchParams.get('orderId') || '');
	const status = $derived($page.url.searchParams.get('status') || '');
	const isCancelled = $derived(status === 'cancel' || status === 'canceled');

	interface BookingSummary {
		name: string;
		email: string | null;
		phone: string;
		doctor: string | null;
		location: string | null;
		date: string | null;
		time: string | null;
		service: string;
		amount: number;
	}

	const summary = $derived((): BookingSummary | null => {
		const raw = $page.url.searchParams.get('s');
		if (!raw) return null;
		try {
			return JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/')));
		} catch {
			return null;
		}
	});

	function formatDateRo(dateStr: string | null): string {
		if (!dateStr) return '';
		try {
			const [y, m, d] = dateStr.split('-');
			return `${d}.${m}.${y}`;
		} catch {
			return dateStr;
		}
	}
</script>

<svelte:head>
	<title>
		{isCancelled ? 'Plată anulată' : 'Programare confirmată'} — Clinica Sf. Gherasim
	</title>
</svelte:head>

<section class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
	<div class="max-w-2xl w-full mx-auto">
		{#if isCancelled}
			<!-- Payment cancelled / failed -->
			<div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
				<div
					class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<span class="text-4xl text-red-600">✕</span>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-3">Plată anulată</h1>
				<p class="text-gray-600 mb-8">
					Plata nu a fost finalizată. Programarea <strong>nu a fost creată</strong>.
					Puteți încerca din nou sau ne puteți contacta telefonic.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/programare"
						class="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold"
					>
						Încearcă din nou
					</a>
					<a
						href="tel:+40711039666"
						class="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold"
					>
						📞 0711 039 666
					</a>
				</div>
			</div>
		{:else}
			<!-- Payment successful -->
			<div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg print:shadow-none">
				<!-- Header -->
				<div class="text-center mb-8">
					<div
						class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<span class="text-4xl text-green-600">✓</span>
					</div>
					<h1 class="text-2xl font-bold text-gray-900 mb-2">Plată confirmată!</h1>
					<p class="text-gray-500 text-sm">
						Programarea dumneavoastră a fost înregistrată cu succes.
					</p>
				</div>

				<!-- Booking details card -->
				{#if summary()}
					<div class="border border-gray-200 rounded-xl overflow-hidden mb-6">
						<div class="bg-primary px-5 py-3">
							<h2 class="font-bold text-white text-sm uppercase tracking-wide">
								Detalii programare
							</h2>
						</div>
						<div class="divide-y divide-gray-100">
							{#if summary()?.name}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Pacient</span>
									<span class="text-gray-800 font-semibold">{summary()?.name}</span>
								</div>
							{/if}
							{#if summary()?.doctor}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Medic</span>
									<span class="text-gray-800">{summary()?.doctor}</span>
								</div>
							{/if}
							{#if summary()?.location}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Locație</span>
									<span class="text-gray-800">{summary()?.location}</span>
								</div>
							{/if}
							{#if summary()?.service}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Serviciu</span>
									<span class="text-gray-800">{summary()?.service}</span>
								</div>
							{/if}
							{#if summary()?.date}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Data</span>
									<span class="text-gray-800">
										{formatDateRo(summary()?.date ?? null)}
										{#if summary()?.time}
											la <strong>{summary()?.time}</strong>
										{/if}
									</span>
								</div>
							{/if}
							{#if summary()?.phone}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Telefon</span>
									<span class="text-gray-800">{summary()?.phone}</span>
								</div>
							{/if}
							{#if summary()?.email}
								<div class="flex justify-between px-5 py-3 text-sm">
									<span class="text-gray-500 font-medium">Email</span>
									<span class="text-gray-800">{summary()?.email}</span>
								</div>
							{/if}
							<div class="flex justify-between px-5 py-3 text-sm bg-green-50">
								<span class="text-gray-500 font-medium">Sumă plătită</span>
								<span class="text-green-700 font-bold">{summary()?.amount} RON</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- Order reference -->
				{#if orderId}
					<div class="bg-gray-50 rounded-lg px-5 py-3 mb-6 flex justify-between items-center text-sm">
						<span class="text-gray-500">Referință plată</span>
						<span class="font-mono text-gray-700">{orderId}</span>
					</div>
				{/if}

				<!-- Next steps -->
				<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-left">
					<h2 class="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">
						Ce urmează?
					</h2>
					<ul class="space-y-2 text-sm text-blue-800">
						<li>• Clinica vă va contacta pentru confirmarea programării</li>
						<li>• Veniți cu 10 minute înainte de ora programată</li>
						<li>• Aduceți actul de identitate</li>
					</ul>
				</div>

				<!-- Action buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
					<a
						href="/"
						class="inline-flex items-center justify-center gap-2 bg-[#dd4444] text-white px-6 py-3 rounded-xl font-bold"
					>
						Pagina principală
					</a>
					<a
						href="/programare"
						class="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold"
					>
						Programare nouă
					</a>
					<button
						onclick={() => window.print()}
						class="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold"
					>
						🖨️ Imprimă
					</button>
				</div>
			</div>
		{/if}

		<!-- Contact info -->
		<div class="mt-8 text-center text-sm text-gray-500 print:hidden">
			<p>
				Probleme? Contactați-ne la
				<a href="tel:+40711039666" class="text-primary font-medium">0711 039 666</a>
				sau
				<a href="mailto:office@psimed.ro" class="text-primary font-medium">office@psimed.ro</a>
			</p>
		</div>
	</div>
</section>
