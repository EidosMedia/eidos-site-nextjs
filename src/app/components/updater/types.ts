import type { UpdaterTopicSlug } from '@/utilities/updaterTopics';

// Serializable view model of an Updater article, built server side from the Neon section listing
// and passed to the (client) topic grid.
export type UpdaterItem = {
  id: string;
  url: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  topic?: UpdaterTopicSlug;
  publicationTime?: string;
  readingMinutes?: number;
  byline?: string;
};
