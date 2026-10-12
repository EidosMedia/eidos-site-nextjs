import {
  SectionCategory,
  findCategory,
  getCategorySlugFromUrl,
  getListingSectionUrl,
  getNodeCategory,
  isCategorySlug,
} from '@/utilities/sectionCategories';

// Label shown for the Newsroom section in breadcrumbs, back links and search placeholders
export const NEWSROOM_LABEL = 'Latest news';

// Categories for the Eidosmedia Newsroom section: each one is a subsection of the Newsroom in Neon
// (e.g. /about-eidosmedia/newsroom/news-release/), set as the article's main section.
export type NewsCategorySlug = 'news-release' | 'product-news' | 'event-news';

export const NEWS_CATEGORIES: SectionCategory<NewsCategorySlug>[] = [
  {
    slug: 'news-release',
    label: 'News release',
    plural: 'News releases',
    blurb: 'Company announcements and press releases.',
    tone: 'indigo',
  },
  {
    slug: 'product-news',
    label: 'Product news',
    plural: 'Product news',
    blurb: 'Updates about our products and platform.',
    tone: 'blue',
  },
  {
    slug: 'event-news',
    label: 'Event news',
    plural: 'Event news',
    blurb: 'Conferences, webinars and events we take part in.',
    tone: 'green',
  },
];

export const isNewsCategorySlug = (value: string): value is NewsCategorySlug =>
  isCategorySlug(NEWS_CATEGORIES, value);

export const getNewsCategory = (slug: string) => findCategory(NEWS_CATEGORIES, slug);

export const getNewsCategoryLabel = (slug?: string) => findCategory(NEWS_CATEGORIES, slug)?.label;

// Last path segment of a section URL, if it names a category (e.g. /about-eidosmedia/newsroom/news-release/).
export const getNewsCategorySlugFromUrl = (url?: string) => getCategorySlugFromUrl(NEWS_CATEGORIES, url);

// Newsroom URL of an article, also when it lives in a category subsection
// (/about-eidosmedia/newsroom/news-release/<id>/index.html → /about-eidosmedia/newsroom/).
export const getNewsroomUrl = (articleUrl: string) => getListingSectionUrl(NEWS_CATEGORIES, articleUrl);

export const getNodeNewsCategory = (node?: Parameters<typeof getNodeCategory>[1]) =>
  getNodeCategory(NEWS_CATEGORIES, node);
