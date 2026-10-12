import { BaseModel, ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { extractPlainText, findElementsInContentJson } from '@/utilities/content';
import { loadFullArticle } from '@/utilities/articleLoader';

const WORDS_PER_MINUTE = 200;

// Estimated reading time of an article body, in minutes (at least 1).
export const getReadingMinutes = (contentData?: ContentElement) => {
  const text = contentData ? findElementsInContentJson(['text'], contentData)[0] : undefined;
  const words = (text?.elements ?? [])
    .map(element => extractPlainText(element))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

// Listings don't carry the article body: fetch each listed article to estimate its reading time.
export const withReadingTimes = async (nodes: Record<string, BaseModel>, ids: string[]) => {
  const entries = await Promise.all(
    ids.map(async id => {
      const url = nodes[id]?.url;
      const fullArticle = url ? await loadFullArticle(url) : undefined;
      const contentData = (fullArticle as { files?: { content?: { data?: ContentElement } } } | undefined)?.files
        ?.content?.data;
      return [id, contentData ? getReadingMinutes(contentData) : undefined] as const;
    }),
  );
  return Object.fromEntries(entries.filter(([, minutes]) => minutes !== undefined)) as Record<string, number>;
};
