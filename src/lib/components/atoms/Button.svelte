<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary';
	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: () => void;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const colors: Record<ButtonVariant, string> = {
		primary: '#dd4444',
		secondary: 'rgb(147, 112, 219)'
	};

	const sizes: Record<ButtonSize, string> = {
		sm: 'px-5 py-2.5 text-sm',
		md: 'px-7 py-3.5 text-base',
		lg: 'px-9 py-4 text-lg'
	};

	const baseClasses =
		'inline-block rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 shadow-2xl hover:shadow-2xl hover:scale-105';

	const buttonClasses = `${baseClasses} ${sizes[size]}`;
</script>

{#if href}
	<a {href} class={buttonClasses} style="background-color: {colors[variant]}" aria-disabled={disabled}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={buttonClasses} style="background-color: {colors[variant]}" {disabled} {onclick}>
		{@render children?.()}
	</button>
{/if}
