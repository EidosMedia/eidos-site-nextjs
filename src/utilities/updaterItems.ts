import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { WebpageModel } from '@/types/models/WebpageModel';
import type { UpdaterItem } from '@/app/components/updater/types';
import { getNewsImageUrl } from '@/utilities/news';
import { withFallbackImages } from '@/utilities/newsImages';
import { withCategorySections } from '@/utilities/categorySections';
import { withReadingTimes } from '@/utilities/readingTime';
import { loadFullArticle } from '@/utilities/articleLoader';
import { UPDATER_TOPICS, getNodeUpdaterTopic } from '@/utilities/updaterTopics';

// All articles of the Updater section (/updater/ and its topic subsections), newest first,
// as card view models (image, topic, reading time, byline).
export const loadUpdaterItems = async (data: PageData<WebpageModel>): Promise<UpdaterItem[]> => {
  const section = await withCategorySections(data, UPDATER_TOPICS);
  const ids = section.model.data.children || [];
  const nodes = await withFallbackImages(section.model.nodes, ids);
  const readingTimes = await withReadingTimes(nodes, ids);
  const updaterUrl = data.model.data.url || '/updater/';

  return ids
    .map(id => nodes[id])
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.pubInfo?.publicationTime ?? 0).getTime() - new Date(a.pubInfo?.publicationTime ?? 0).getTime(),
    )
    .map(node => {
      const topic = getNodeUpdaterTopic(node);
      return {
        id: node.id,
        url: node.url,
        title: node.title,
        summary: node.summary,
        imageUrl: getNewsImageUrl(node, 'Wide_large') ?? getNewsImageUrl(node, 'Wide_small'),
        topic,
        topicUrl: topic && `${updaterUrl}${topic}/`,
        publicationTime: node.pubInfo?.publicationTime,
        readingMinutes: readingTimes[node.id],
        byline: (node.attributes as { byline?: string } | undefined)?.byline,
      };
    });
};

// Byline of a featured article: the listing "byline" attribute, otherwise the article authors.
export const withByline = async (item: UpdaterItem): Promise<UpdaterItem> => {
  if (item.byline) return item;
  const fullArticle = (await loadFullArticle(item.url)) as { authors?: string[] } | undefined;
  return { ...item, byline: fullArticle?.authors?.join(', ') || undefined };
};
