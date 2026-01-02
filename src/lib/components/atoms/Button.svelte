<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary' | 'outline';
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

	const variants: Record<ButtonVariant, string> = {
		primary:
			'bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:scale-105 focus:ring-primary disabled:bg-gray-300 shadow-lg',
		secondary:
			'bg-secondary-dark text-white hover:bg-secondary hover:shadow-xl hover:scale-105 focus:ring-secondary shadow-lg',
		outline:
			'border-3 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:scale-105 focus:ring-primary disabled:border-gray-300 disabled:text-gray-300 bg-white'
	};

	const sizes: Record<ButtonSize, string> = {
		sm: 'px-5 py-2.5 text-sm',
		md: 'px-7 py-3.5 text-base',
		lg: 'px-9 py-4 text-lg'
	};

	const baseClasses =
		'inline-block rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100';

	const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]}`;
</script>

{#if href}
	<a {href} class={buttonClasses} aria-disabled={disabled}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={buttonClasses} {disabled} {onclick}>
		{@render children?.()}
	</button>
{/if}
