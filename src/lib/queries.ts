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

export const problemsQuery = /* groq */ `
  *[_type == "problem"] | order(category asc, order asc, title asc) {
    "slug": slug.current,
    title,
    subtitle,
    category,
    icon,
    shortDescription
  }
`;

export type ProblemCard = {
	slug: string;
	title: string;
	subtitle?: string;
	category: 'copii' | 'adulti';
	icon?: string;
	shortDescription: string;
};

export const problemBySlugQuery = /* groq */ `
  *[_type == "problem" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    subtitle,
    category,
    icon,
    shortDescription,
    heroDescription,
    symptoms,
    whenToSeekHelp,
    treatments[]{ name, description },
    specialists,
    relatedProblems[]{ title, href },
    specialtyParam
  }
`;

export type ProblemFull = {
	slug: string;
	title: string;
	subtitle?: string;
	category: 'copii' | 'adulti';
	icon?: string;
	shortDescription: string;
	heroDescription?: string;
	symptoms?: string[];
	whenToSeekHelp?: string[];
	treatments?: Array<{ name: string; description: string }>;
	specialists?: string[];
	relatedProblems?: Array<{ title: string; href: string }>;
	specialtyParam?: string;
} | null;

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]{
    heroTitle,
    heroTitleAccent,
    heroLead,
    stats[]{ value, label, color },
    storyEyebrow,
    storyTitle,
    storyBody,
    storyQuoteText,
    storyQuoteAttribution,
    missionVisionEyebrow,
    missionVisionTitle,
    missionText,
    visionText,
    valuesEyebrow,
    valuesTitle,
    values[]{ iconName, title, description, color },
    whyChooseUsEyebrow,
    whyChooseUsTitle,
    whyChooseUsItems[]{ iconName, title, description }
  }
`;

type ColorTheme = 'primary' | 'secondary' | 'accent' | 'nature';

export type AboutPage = {
	heroTitle?: string;
	heroTitleAccent?: string;
	heroLead?: string;
	stats?: Array<{ value: string; label: string; color?: ColorTheme }>;
	storyEyebrow?: string;
	storyTitle?: string;
	storyBody?: unknown[];
	storyQuoteText?: string;
	storyQuoteAttribution?: string;
	missionVisionEyebrow?: string;
	missionVisionTitle?: string;
	missionText?: string;
	visionText?: string;
	valuesEyebrow?: string;
	valuesTitle?: string;
	values?: Array<{ iconName: string; title: string; description: string; color?: ColorTheme }>;
	whyChooseUsEyebrow?: string;
	whyChooseUsTitle?: string;
	whyChooseUsItems?: Array<{ iconName: string; title: string; description: string }>;
} | null;
