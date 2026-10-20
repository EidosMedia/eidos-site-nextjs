import Link from 'next/link';
import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { formatNewsDate, getNewsImageUrl } from '@/utilities/news';
import NewsCategoryBadge from './NewsCategoryBadge';
import { getNodeNewsCategory } from '@/utilities/newsCategories';

type NewsListItemProps = {
  item: BaseModel;
};

// Single row of a news listing (date, category, title, thumbnail).
// Used by the Newsroom lists and by "Read more about" in news articles, so they always match.
// Mobile: stacked (full-width image, date, category, title); md+: date column, text, thumbnail on the right.
const NewsListItem = ({ item }: NewsListItemProps) => {
  // Wide_large first: on mobile the image spans the full column width
  const imageUrl = getNewsImageUrl(item, 'Wide_large') ?? getNewsImageUrl(item, 'Wide_small');
  const date = formatNewsDate(item.pubInfo?.publicationTime);
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-space-sm md:gap-space-md py-space-md">
      <div className="hidden md:block w-news-date shrink-0 whitespace-nowrap text-body-sm text-copy-muted">{date}</div>
      <div className="flex-1 min-w-0">
        <p className="md:hidden text-caption text-copy-muted mb-space-2xs">{date}</p>
        <NewsCategoryBadge category={getNodeNewsCategory(item)} className="mb-space-2xs" />
        <Link href={item.url} className="block text-lead font-title text-heading no-underline hover:underline">
          {item.title}
        </Link>
      </div>
      <div className="order-first md:order-none w-full aspect-video md:w-news-thumb md:h-news-thumb-h md:aspect-auto shrink-0 rounded-media md:rounded-media-sm overflow-hidden bg-surface">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />}
      </div>
    </div>
  );
};

export default NewsListItem;
