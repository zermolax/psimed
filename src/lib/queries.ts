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

export type { DoctorCategory } from './sanity/categories';
import type { DoctorCategory } from './sanity/categories';

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

export const policyPageQuery = /* groq */ `
  *[_type == "policyPage" && key == $key][0]{
    title,
    body,
    lastUpdated
  }
`;

export type PolicyPage = {
	title: string;
	body: unknown[];
	lastUpdated?: string;
} | null;

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]{
    heroTitle,
    heroLead,
    body
  }
`;

export type AboutPage = {
	heroTitle: string;
	heroLead?: string;
	body?: unknown[];
} | null;
