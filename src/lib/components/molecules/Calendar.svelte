<script lang="ts">
	interface Props {
		availableDates: string[];
		selectedDate: string | null;
		onSelectDate: (date: string) => void;
	}

	let { availableDates, selectedDate, onSelectDate }: Props = $props();

	// Current displayed month
	let currentMonth = $state(new Date());

	// Romanian day names (Monday first)
	const dayNames = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

	// Romanian month names
	const monthNames = [
		'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
		'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
	];

	// Convert available dates to Set for quick lookup
	let availableDateSet = $derived(new Set(availableDates));

	// Get days in current month view
	let calendarDays = $derived.by(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		// First day of month
		const firstDay = new Date(year, month, 1);
		// Last day of month
		const lastDay = new Date(year, month + 1, 0);

		// Day of week for first day (0 = Sunday, convert to Monday = 0)
		let startDayOfWeek = firstDay.getDay();
		startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

		const days: Array<{ date: Date; dateString: string; isCurrentMonth: boolean; isAvailable: boolean; isSelected: boolean; isToday: boolean }> = [];

		// Add days from previous month
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			const date = new Date(year, month - 1, prevMonthLastDay - i);
			const dateString = formatDateString(date);
			days.push({
				date,
				dateString,
				isCurrentMonth: false,
				isAvailable: availableDateSet.has(dateString),
				isSelected: selectedDate === dateString,
				isToday: isToday(date)
			});
		}

		// Add days of current month
		for (let day = 1; day <= lastDay.getDate(); day++) {
			const date = new Date(year, month, day);
			const dateString = formatDateString(date);
			days.push({
				date,
				dateString,
				isCurrentMonth: true,
				isAvailable: availableDateSet.has(dateString),
				isSelected: selectedDate === dateString,
				isToday: isToday(date)
			});
		}

		// Add days from next month to complete the grid (6 rows max)
		const remainingDays = 42 - days.length; // 6 rows * 7 days
		for (let i = 1; i <= remainingDays; i++) {
			const date = new Date(year, month + 1, i);
			const dateString = formatDateString(date);
			days.push({
				date,
				dateString,
				isCurrentMonth: false,
				isAvailable: availableDateSet.has(dateString),
				isSelected: selectedDate === dateString,
				isToday: isToday(date)
			});
		}

		return days;
	});

	function formatDateString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function isToday(date: Date): boolean {
		const today = new Date();
		return date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();
	}

	function previousMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	function handleDateClick(day: typeof calendarDays[0]) {
		if (day.isAvailable) {
			onSelectDate(day.dateString);
		}
	}

	// Check if we can go to previous month (don't allow past months)
	let canGoPrevious = $derived.by(() => {
		const today = new Date();
		const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		return currentMonthStart > thisMonthStart;
	});
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
	<!-- Header with month navigation -->
	<div class="flex items-center justify-between mb-4">
		<button
			type="button"
			class="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			onclick={previousMonth}
			disabled={!canGoPrevious}
			aria-label="Luna anterioară"
		>
			<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<h3 class="text-lg font-semibold text-gray-900">
			{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
		</h3>

		<button
			type="button"
			class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
			onclick={nextMonth}
			aria-label="Luna următoare"
		>
			<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<!-- Day names header -->
	<div class="grid grid-cols-7 gap-1 mb-2">
		{#each dayNames as dayName}
			<div class="text-center text-xs font-medium text-gray-500 py-2">
				{dayName}
			</div>
		{/each}
	</div>

	<!-- Calendar grid -->
	<div class="grid grid-cols-7 gap-1">
		{#each calendarDays as day}
			<button
				type="button"
				class="aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative
					{day.isCurrentMonth ? '' : 'text-gray-300'}
					{day.isAvailable && day.isCurrentMonth
						? 'bg-primary/10 text-primary font-semibold hover:bg-primary/20 cursor-pointer'
						: day.isCurrentMonth
							? 'text-gray-400 cursor-not-allowed'
							: 'cursor-not-allowed'}
					{day.isSelected
						? 'bg-primary text-white hover:bg-primary-dark ring-2 ring-primary ring-offset-2'
						: ''}
					{day.isToday && !day.isSelected ? 'ring-1 ring-gray-300' : ''}"
				onclick={() => handleDateClick(day)}
				disabled={!day.isAvailable}
			>
				{day.date.getDate()}
				{#if day.isAvailable && day.isCurrentMonth && !day.isSelected}
					<span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Legend -->
	<div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
				<span class="w-1 h-1 bg-primary rounded-full"></span>
			</span>
			<span>Disponibil</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 rounded bg-primary"></span>
			<span>Selectat</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 rounded bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">-</span>
			<span>Indisponibil</span>
		</div>
	</div>
</div>
