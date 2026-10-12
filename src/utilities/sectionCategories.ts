import type { BadgeTone } from '@/app/components/baseComponents/badge';

// A category is a subsection of a listing section in Neon (e.g. /about-eidosmedia/newsroom/news-release/,
// /updater/technology/), set as the article's main section. Used by the Newsroom categories and the Updater topics.
export type SectionCategory<S extends string = string> = {
  slug: S;
  label: string;
  plural: string;
  blurb: string;
  tone: BadgeTone;
};

type CategorizedNode = { attributes?: object; pubInfo?: object; url?: string };

export const findCategory = <S extends string>(categories: SectionCategory<S>[], slug?: string) =>
  slug ? categories.find(category => category.slug === slug) : undefined;

export const isCategorySlug = <S extends string>(categories: SectionCategory<S>[], value: string): value is S =>
  categories.some(category => category.slug === value);

// Last path segment of a section URL, if it names a category
export const getCategorySlugFromUrl = <S extends string>(categories: SectionCategory<S>[], url?: string) => {
  const lastSegment = url?.split('/').filter(Boolean).pop();
  return lastSegment && isCategorySlug(categories, lastSegment) ? lastSegment : undefined;
};

// Section URL of an article (<section>/<id>/index.html → <section>/)
const getSectionUrl = (articleUrl: string) => articleUrl.replace(/[^/]+\/(index\.html)?$/, '');

// Listing section URL of an article, also when it lives in a category subsection
// (/updater/technology/<id>/index.html → /updater/).
export const getListingSectionUrl = <S extends string>(categories: SectionCategory<S>[], articleUrl: string) => {
  const sectionUrl = getSectionUrl(articleUrl);
  return getCategorySlugFromUrl(categories, sectionUrl) ? sectionUrl.replace(/[^/]+\/$/, '') : sectionUrl;
};

// Category of an item, in order: the explicit attributes.category, the category subsection it is
// published in as main section (from its URL), a category section set as secondary section.
export const getNodeCategory = <S extends string>(
  categories: SectionCategory<S>[],
  node?: CategorizedNode,
): S | undefined => {
  const explicit = (node?.attributes as { category?: unknown } | undefined)?.category;
  if (typeof explicit === 'string' && isCategorySlug(categories, explicit)) return explicit;
  const mainSection = node?.url ? getCategorySlugFromUrl(categories, getSectionUrl(node.url)) : undefined;
  if (mainSection) return mainSection;
  const sections = (node?.pubInfo as { secondarySections?: string[] } | undefined)?.secondarySections ?? [];
  return sections.map(section => getCategorySlugFromUrl(categories, section)).find(Boolean);
};
