<script lang="ts">
	import { PortableText, type PortableTextComponents } from '@portabletext/svelte';
	import H2 from './portable/H2.svelte';
	import H3 from './portable/H3.svelte';
	import Paragraph from './portable/Paragraph.svelte';
	import Bullet from './portable/Bullet.svelte';
	import Number from './portable/Number.svelte';
	import Link from './portable/Link.svelte';

	let { value }: { value: unknown[] } = $props();

	const components: PortableTextComponents = {
		block: {
			normal: Paragraph,
			h2: H2,
			h3: H3
		},
		list: {
			bullet: Bullet,
			number: Number
		},
		marks: {
			link: Link
		}
	};
</script>

<div class="space-y-4 text-gray-700 leading-relaxed">
	<PortableText {value} {components} />
</div>
