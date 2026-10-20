import ArticleCard from '../article/ArticleCard';
import { getUpdaterTopic } from '@/utilities/updaterTopics';
import type { UpdaterItem } from './types';

type UpdaterCardProps = {
  item: UpdaterItem;
  // "latest": reading time only; "topic": date and reading time
  variant?: 'latest' | 'topic';
  // false on a topic page, where every card has the same topic
  showTopic?: boolean;
};

const formatCardDate = (isoDate?: string) =>
  isoDate ? new Date(isoDate).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : '';

// ArticleCard for an Updater article: topic badge and date / reading time meta.
const UpdaterCard = ({ item, variant = 'topic', showTopic = true }: UpdaterCardProps) => {
  const topic = showTopic ? getUpdaterTopic(item.topic) : undefined;
  const readingTime = item.readingMinutes ? `${item.readingMinutes} min read` : undefined;
  const meta =
    variant === 'latest'
      ? readingTime
      : [formatCardDate(item.publicationTime), readingTime].filter(Boolean).join(' - ');

  return (
    <ArticleCard
      href={item.url}
      title={item.title}
      imageUrl={item.imageUrl}
      summary={item.summary}
      badge={topic && { label: topic.label, tone: topic.tone, href: item.topicUrl }}
      meta={meta || undefined}
    />
  );
};

export default UpdaterCard;
