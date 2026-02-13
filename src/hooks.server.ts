import { redirect, type Handle } from '@sveltejs/kit';

/**
 * URL Redirects for site restructuring
 * Old URLs are redirected to new structure
 */
const redirects: Record<string, string> = {
	// Old service pages → Ce Tratăm hub
	'/servicii': '/ce-tratam',
	'/tratamente': '/ce-tratam',

	// Old service anchors → specific problem pages
	'/servicii#psihiatrie-adulti': '/ce-tratam#adulti',
	'/servicii#psihiatrie-pediatrica': '/ce-tratam#copii',
	'/servicii#psihologie-clinica': '/ce-tratam',
	'/servicii#psihoterapie': '/ce-tratam',

	// Evaluări → Ce Tratăm (since evaluations are part of treatments)
	'/evaluari-psihologice': '/ce-tratam',

	// Treatment pages → specific problem pages
	'/tratamente/neurofeedback': '/ce-tratam/adhd',
	'/tratamente/hipnoza-clinica': '/ce-tratam/anxietate'
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const hash = event.url.hash;
	const fullPath = path + hash;

	// Check for exact match first
	if (redirects[fullPath]) {
		throw redirect(301, redirects[fullPath]);
	}

	// Check for path-only match
	if (redirects[path]) {
		throw redirect(301, redirects[path]);
	}

	// Check for partial matches (e.g., /servicii/something)
	if (path.startsWith('/servicii/')) {
		throw redirect(301, '/ce-tratam');
	}

	if (path.startsWith('/tratamente/')) {
		throw redirect(301, '/ce-tratam');
	}

	return resolve(event);
};
