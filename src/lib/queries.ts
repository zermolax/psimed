export const blogPostsQuery = /* groq */ `
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    "coverUrl": cover.asset->url,
    "author": author->{ name, title }
  }
`;

export type BlogPostCard = {
	slug: string;
	title: string;
	excerpt?: string;
	publishedAt: string;
	coverUrl?: string;
	author?: { name: string; title?: string };
};

export const blogPostBySlugQuery = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    "coverUrl": cover.asset->url,
    "author": author->{ name, title, "image": photo.asset->url },
    body,
    seoTitle,
    seoDescription
  }
`;

export type BlogPostFull = {
	slug: string;
	title: string;
	excerpt?: string;
	publishedAt: string;
	coverUrl?: string;
	author?: { name: string; title?: string; image?: string };
	body?: unknown[];
	seoTitle?: string;
	seoDescription?: string;
} | null;

export const allBlogPostSlugsQuery = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current
  }
`;

export const promotionsQuery = /* groq */ `
  *[_type == "promotion" && defined(publishedAt) && publishedAt <= now()
    && (!defined(expiresAt) || expiresAt > now())]
    | order(publishedAt desc) {
    "slug": slug.current,
    title,
    locale,
    campaignKey,
    subtitle,
    excerpt,
    "coverUrl": cover.asset->url,
    publishedAt
  }
`;

export type PromotionCard = {
	slug: string;
	title: string;
	locale: 'ro' | 'en' | 'it';
	campaignKey: string;
	subtitle?: string;
	excerpt?: string;
	coverUrl?: string;
	publishedAt: string;
};

export const promotionBySlugQuery = /* groq */ `
  *[_type == "promotion" && slug.current == $slug
    && defined(publishedAt) && publishedAt <= now()
    && (!defined(expiresAt) || expiresAt > now())][0] {
    "slug": slug.current,
    title,
    locale,
    campaignKey,
    subtitle,
    "coverUrl": cover.asset->url,
    excerpt,
    intro,
    bullets[]{ iconName, label, description },
    closing,
    ctaText,
    ctaSubtext,
    ctaHref,
    hashtags,
    disclaimer,
    seoTitle,
    seoDescription,
    seoKeywords,
    "altLanguages": *[_type == "promotion" && campaignKey == ^.campaignKey
      && _id != ^._id && defined(publishedAt) && publishedAt <= now()] {
      locale,
      "url": "/promotii/" + slug.current,
      "label": select(
        locale == "ro" => "Română",
        locale == "en" => "English",
        locale == "it" => "Italiano",
        locale
      )
    }
  }
`;

export type PromotionFull = {
	slug: string;
	title: string;
	locale: 'ro' | 'en' | 'it';
	campaignKey: string;
	subtitle?: string;
	coverUrl?: string;
	excerpt?: string;
	intro?: unknown[];
	bullets?: Array<{ iconName?: string; label: string; description?: string }>;
	closing?: unknown[];
	ctaText?: string;
	ctaSubtext?: string;
	ctaHref?: string;
	hashtags?: string[];
	disclaimer?: unknown[];
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string[];
	altLanguages?: Array<{ locale: 'ro' | 'en' | 'it'; url: string; label: string }>;
} | null;

export const allPromotionSlugsQuery = /* groq */ `
  *[_type == "promotion" && defined(slug.current)
    && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current
  }
`;

export const pageBySlugQuery = /* groq */ `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    heroTitle,
    heroLead,
    body,
    seoTitle,
    seoDescription
  }
`;

export type GenericPage = {
	title: string;
	slug: string;
	heroTitle?: string;
	heroLead?: string;
	body?: unknown[];
	seoTitle?: string;
	seoDescription?: string;
} | null;

export const allPageSlugsQuery = /* groq */ `
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    title,
    phone,
    email,
    address,
    navigation[]{
      label,
      href,
      children[]{
        label,
        href,
        isHeading
      }
    }
  }
`;

export type NavChild = {
	label: string;
	href?: string;
	isHeading?: boolean;
};

export type NavItem = {
	label: string;
	href: string;
	children?: NavChild[];
};

export type SiteSettings = {
	title?: string;
	phone?: string;
	email?: string;
	address?: string;
	navigation?: NavItem[];
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
    storyEyebrow,
    storyTitle,
    storyBody,
    foundationsEyebrow,
    foundationsTitle,
    missionText,
    visionText,
    principles[]{ iconName, title, description }
  }
`;

export type AboutPage = {
	heroTitle?: string;
	heroTitleAccent?: string;
	heroLead?: string;
	storyEyebrow?: string;
	storyTitle?: string;
	storyBody?: unknown[];
	foundationsEyebrow?: string;
	foundationsTitle?: string;
	missionText?: string;
	visionText?: string;
	principles?: Array<{ iconName?: string; title: string; description?: string }>;
} | null;
