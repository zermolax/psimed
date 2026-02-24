import { redirect } from '@sveltejs/kit';

// Old WordPress URL indexed by Google — redirect permanently to /ce-tratam
export const load = () => {
	throw redirect(301, '/ce-tratam');
};

export const prerender = true;
