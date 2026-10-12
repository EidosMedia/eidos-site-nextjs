import { SectionCategory, findCategory, getNodeCategory, isCategorySlug } from '@/utilities/sectionCategories';

// Label shown for the Updater section in back links and search placeholders
export const UPDATER_LABEL = 'The Updater';

// Topics of the "Insights - The Updater" blog: each one is a subsection of /updater/ in Neon
// (e.g. /updater/technology/), set as the article's main section.
export type UpdaterTopicSlug = 'technology' | 'new-media' | 'business' | 'social';

export const UPDATER_TOPICS: SectionCategory<UpdaterTopicSlug>[] = [
  {
    slug: 'technology',
    label: 'Technology',
    plural: 'Technology',
    blurb: 'Technology behind content creation and delivery.',
    tone: 'indigo',
  },
  {
    slug: 'new-media',
    label: 'New media',
    plural: 'New media',
    blurb: 'How media organizations are evolving.',
    tone: 'mint',
  },
  {
    slug: 'business',
    label: 'Business',
    plural: 'Business',
    blurb: 'Markets, strategy and the business of content.',
    tone: 'rose',
  },
  {
    slug: 'social',
    label: 'Social',
    plural: 'Social',
    blurb: 'Audiences, platforms and society.',
    tone: 'sky',
  },
];

export const isUpdaterTopicSlug = (value: string): value is UpdaterTopicSlug => isCategorySlug(UPDATER_TOPICS, value);

export const getUpdaterTopic = (slug?: string) => findCategory(UPDATER_TOPICS, slug);

export const getNodeUpdaterTopic = (node?: Parameters<typeof getNodeCategory>[1]) =>
  getNodeCategory(UPDATER_TOPICS, node);
