import forge from 'node-forge';
import {
	NETOPIA_MERCHANT_ID,
	NETOPIA_PUBLIC_CERT_B64,
	NETOPIA_PRIVATE_KEY_B64,
	NETOPIA_SANDBOX
} from '$env/static/private';
import { randomBytes } from 'crypto';

const SANDBOX_URL = 'https://sandboxsecure.mobilpay.ro';
const PRODUCTION_URL = 'https://secure.mobilpay.ro';

export interface OrderParams {
	orderId: string;
	amount: number; // RON
	currency: string;
	details: string;
	patientNume: string;
	patientPrenume: string;
	patientEmail: string;
	patientTelefon: string;
	bookingPayload: Record<string, unknown>;
	confirmUrl: string;
	returnUrl: string;
}

export interface EncryptedOrder {
	env_key: string;
	data: string;
	payment_url: string;
}

// ─── RC4 (pure TS — node-forge v1.x removed it, Node 25 OpenSSL 3 disabled it) ─
function rc4(key: Buffer, data: Buffer): Buffer {
	const S = Array.from({ length: 256 }, (_, i) => i);
	let j = 0;
	for (let i = 0; i < 256; i++) {
		j = (j + S[i] + key[i % key.length]) & 0xff;
		[S[i], S[j]] = [S[j], S[i]];
	}
	const out = Buffer.alloc(data.length);
	let a = 0,
		b = 0;
	for (let n = 0; n < data.length; n++) {
		a = (a + 1) & 0xff;
		b = (b + S[a]) & 0xff;
		[S[a], S[b]] = [S[b], S[a]];
		out[n] = data[n] ^ S[(S[a] + S[b]) & 0xff];
	}
	return out;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadCerts(): { publicCertPem: string; privateKeyPem: string } {
	if (!NETOPIA_PUBLIC_CERT_B64 || !NETOPIA_PRIVATE_KEY_B64) {
		throw new Error(
			'Netopia credentials missing: set NETOPIA_PUBLIC_CERT_B64 and NETOPIA_PRIVATE_KEY_B64 env vars'
		);
	}
	const publicCertPem = Buffer.from(NETOPIA_PUBLIC_CERT_B64, 'base64').toString('utf8');
	const privateKeyPem = Buffer.from(NETOPIA_PRIVATE_KEY_B64, 'base64').toString('utf8');
	return { publicCertPem, privateKeyPem };
}

function buildTimestamp(): string {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return (
		`${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
		`${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
	);
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// ─── XML builder ─────────────────────────────────────────────────────────────

export function buildOrderXML(params: OrderParams): string {
	const {
		orderId,
		amount,
		currency,
		details,
		patientNume,
		patientPrenume,
		patientEmail,
		patientTelefon,
		bookingPayload,
		confirmUrl,
		returnUrl
	} = params;

	const bookingB64 = Buffer.from(JSON.stringify(bookingPayload)).toString('base64');
	const amountFormatted = amount.toFixed(2);
	const timestamp = buildTimestamp();
	const merchantId = NETOPIA_MERCHANT_ID;

	return `<?xml version="1.0" encoding="utf-8"?>
<order type="card" id="${escapeXml(orderId)}" timestamp="${timestamp}">
  <signature>${escapeXml(merchantId)}</signature>
  <invoice currency="${escapeXml(currency)}" amount="${amountFormatted}">
    <details>${escapeXml(details)}</details>
    <contact>
      <lastName>${escapeXml(patientNume)}</lastName>
      <firstName>${escapeXml(patientPrenume)}</firstName>
      <email>${escapeXml(patientEmail)}</email>
      <mobilePhone>${escapeXml(patientTelefon)}</mobilePhone>
      <address/>
    </contact>
  </invoice>
  <params>
    <param>
      <name>d</name>
      <value>${bookingB64}</value>
    </param>
  </params>
  <url>
    <confirm>${escapeXml(confirmUrl)}</confirm>
    <return>${escapeXml(returnUrl)}</return>
  </url>
</order>`;
}

// ─── Encrypt (order → Netopia) ────────────────────────────────────────────────

export function encryptOrder(xml: string, publicCertPem: string): { env_key: string; data: string } {
	// 1. Random 16-byte RC4 key
	const rc4Key = randomBytes(16);

	// 2. RC4-encrypt the XML
	const xmlBuf = Buffer.from(xml, 'utf8');
	const encryptedData = rc4(rc4Key, xmlBuf);

	// 3. RSA-PKCS1v1.5 encrypt the RC4 key with Netopia's public certificate
	const cert = forge.pki.certificateFromPem(publicCertPem);
	const publicKey = cert.publicKey as forge.pki.rsa.PublicKey;

	// forge works with binary strings — convert Buffer → binary string
	const rc4KeyBinary = rc4Key.toString('binary');
	const encryptedKeyBinary = publicKey.encrypt(rc4KeyBinary, 'RSAES-PKCS1-V1_5');

	return {
		env_key: Buffer.from(encryptedKeyBinary, 'binary').toString('base64'),
		data: encryptedData.toString('base64')
	};
}

// ─── Decrypt (IPN ← Netopia) ──────────────────────────────────────────────────

export function decryptCallback(envKeyB64: string, dataB64: string, privateKeyPem: string): string {
	// 1. RSA-decrypt the env_key to get the RC4 symmetric key
	const privateKey = forge.pki.privateKeyFromPem(privateKeyPem) as forge.pki.rsa.PrivateKey;
	const encryptedKeyBinary = Buffer.from(envKeyB64, 'base64').toString('binary');
	const rc4KeyBinary = privateKey.decrypt(encryptedKeyBinary, 'RSAES-PKCS1-V1_5');
	const rc4Key = Buffer.from(rc4KeyBinary, 'binary');

	// 2. RC4-decrypt the data to get the XML
	const encryptedData = Buffer.from(dataB64, 'base64');
	const xml = rc4(rc4Key, encryptedData);

	return xml.toString('utf8');
}

// ─── IPN response ─────────────────────────────────────────────────────────────

export function buildIpnResponse(errorType: string, errorCode: string, message: string): string {
	return `<?xml version="1.0" encoding="utf-8"?>\n<crc error_type="${errorType}" error_code="${errorCode}">${escapeXml(message)}</crc>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getPaymentUrl(): string {
	return NETOPIA_SANDBOX === 'true' ? SANDBOX_URL : PRODUCTION_URL;
}

export async function createEncryptedOrder(params: OrderParams): Promise<EncryptedOrder> {
	const { publicCertPem } = loadCerts();
	const xml = buildOrderXML(params);
	const { env_key, data } = encryptOrder(xml, publicCertPem);
	return { env_key, data, payment_url: getPaymentUrl() };
}

export function decryptIpnCallback(envKeyB64: string, dataB64: string): string {
	const { privateKeyPem } = loadCerts();
	return decryptCallback(envKeyB64, dataB64, privateKeyPem);
}
