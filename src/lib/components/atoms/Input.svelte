<script lang="ts">
	type InputType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';

	interface Props {
		type?: InputType;
		name: string;
		label?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		onchange?: (value: string) => void;
	}

	let {
		type = 'text',
		name,
		label,
		placeholder,
		value = $bindable(''),
		required = false,
		disabled = false,
		error
	}: Props = $props();

	const baseClasses =
		'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed';

	const inputClasses = error
		? `${baseClasses} border-red-500 focus:ring-red-500`
		: `${baseClasses} border-gray-300`;
</script>

<div class="w-full">
	{#if label}
		<label for={name} class="block text-sm font-medium text-gray-700 mb-2">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		id={name}
		{type}
		{name}
		{placeholder}
		bind:value
		{required}
		{disabled}
		class={inputClasses}
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${name}-error` : undefined}
	/>

	{#if error}
		<p id="{name}-error" class="mt-1 text-sm text-red-600">
			{error}
		</p>
	{/if}
</div>
