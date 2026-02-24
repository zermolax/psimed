import forge from 'node-forge';
import {
	NETOPIA_MERCHANT_ID,
	NETOPIA_PUBLIC_CERT_B64,
	NETOPIA_PRIVATE_KEY_B64,
	NETOPIA_SANDBOX
} from '$env/static/private';

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

export function encryptOrder(xml: string, publicCertPem: string): { env_key: string; data: string } {
	// 1. Generate random 16-byte RC4 symmetric key
	const rc4Key = forge.random.getBytesSync(16);

	// 2. Encrypt XML with RC4
	const rc4 = forge.rc4.create();
	rc4.start(rc4Key);
	const xmlBytes = forge.util.encodeUtf8(xml);
	const buf = forge.util.createBuffer(xmlBytes);
	rc4.update(buf);
	const encryptedData = forge.util.encode64(buf.getBytes());

	// 3. RSA-encrypt the RC4 key with Netopia's public certificate
	const cert = forge.pki.certificateFromPem(publicCertPem);
	const publicKey = cert.publicKey as forge.pki.rsa.PublicKey;
	const encryptedKey = publicKey.encrypt(rc4Key, 'RSAES-PKCS1-V1_5');
	const envKey = forge.util.encode64(encryptedKey);

	return { env_key: envKey, data: encryptedData };
}

export function decryptCallback(envKeyB64: string, dataB64: string, privateKeyPem: string): string {
	// 1. RSA-decrypt env_key to get RC4 symmetric key
	const privateKey = forge.pki.privateKeyFromPem(privateKeyPem) as forge.pki.rsa.PrivateKey;
	const encryptedKey = forge.util.decode64(envKeyB64);
	const rc4Key = privateKey.decrypt(encryptedKey, 'RSAES-PKCS1-V1_5');

	// 2. RC4-decrypt data to get XML
	const encryptedData = forge.util.decode64(dataB64);
	const rc4 = forge.rc4.create();
	rc4.start(rc4Key);
	const buf = forge.util.createBuffer(encryptedData);
	rc4.update(buf);
	const xml = forge.util.decodeUtf8(buf.getBytes());

	return xml;
}

export function buildIpnResponse(errorType: string, errorCode: string, message: string): string {
	return `<?xml version="1.0" encoding="utf-8"?>\n<crc error_type="${errorType}" error_code="${errorCode}">${escapeXml(message)}</crc>`;
}

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

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
