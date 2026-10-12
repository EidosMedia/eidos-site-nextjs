import { getNewsCategory } from '@/utilities/newsCategories';
import Badge from '../baseComponents/badge';

type NewsCategoryBadgeProps = {
  category?: string;
  className?: string;
};

// Category label of a news item, colored by category (see NEWS_CATEGORIES tones).
const NewsCategoryBadge = ({ category, className = '' }: NewsCategoryBadgeProps) => {
  const config = category ? getNewsCategory(category) : undefined;
  if (!config) return null;
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
};

export default NewsCategoryBadge;
