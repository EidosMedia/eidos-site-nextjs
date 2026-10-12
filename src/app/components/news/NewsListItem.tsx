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
const NewsListItem = ({ item }: NewsListItemProps) => {
  const imageUrl = getNewsImageUrl(item, 'Wide_small') ?? getNewsImageUrl(item, 'Wide_large');
  return (
    <div className="flex items-start gap-space-md py-space-md">
      <div className="w-40 shrink-0 whitespace-nowrap text-body-sm text-copy-muted">
        {formatNewsDate(item.pubInfo?.publicationTime)}
      </div>
      <div className="flex-1 min-w-0">
        <NewsCategoryBadge category={getNodeNewsCategory(item)} className="mb-space-2xs" />
        <Link href={item.url} className="block text-lead font-semibold text-heading no-underline hover:underline">
          {item.title}
        </Link>
      </div>
      <div className="w-52 h-36 shrink-0 rounded-media-sm overflow-hidden bg-surface">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />}
      </div>
    </div>
  );
};

export default NewsListItem;
