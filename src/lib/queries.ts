export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    title,
    phone,
    email,
    address
  }
`;

export type SiteSettings = {
	title?: string;
	phone?: string;
	email?: string;
	address?: string;
} | null;
