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

export const doctorsQuery = /* groq */ `
  *[_type == "doctor"] | order(order asc, name asc) {
    "id": slug.current,
    name,
    title,
    category,
    specialties,
    description,
    education,
    experience,
    medsoftDoctorId,
    "image": photo.asset->url
  }
`;

export type DoctorCategory = 'psihiatru' | 'psiholog' | 'terapeut' | 'alt-specialist';

export type Doctor = {
	id: string;
	name: string;
	title: string;
	category: DoctorCategory;
	specialties: string[];
	description: string;
	education?: string[];
	experience?: string;
	medsoftDoctorId?: string;
	image?: string;
};
