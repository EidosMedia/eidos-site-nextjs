import Link from 'next/link';
import Badge, { BadgeTone } from '../baseComponents/badge';

export type ArticleCardProps = {
  href: string;
  title: string;
  imageUrl?: string;
  summary?: string;
  // Category / topic label above the title
  badge?: { label: string; tone: BadgeTone };
  // Bottom line, e.g. "July 07, 2026 - 5 min read"
  meta?: string;
};

// Article card used by every card grid (Updater listings, related articles): cover image, optional badge,
// title, optional summary and meta line. The whole card is a link.
const ArticleCard = ({ href, title, imageUrl, summary, badge, meta }: ArticleCardProps) => (
  <Link
    href={href}
    className="group flex flex-col h-full bg-canvas border border-line rounded-card overflow-hidden no-underline transition-shadow hover:shadow-lg"
  >
    {/* DS media shape: the card background shows through the rounded bottom-right corner */}
    <div className="aspect-video bg-surface overflow-hidden rounded-media">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}
    </div>
    <div className="flex flex-col flex-1 p-space-md gap-space-xs">
      {badge && (
        <div>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>
      )}
      <p className="text-body font-bold text-heading group-hover:underline">{title}</p>
      {summary && <p className="text-body-sm text-copy-muted line-clamp-4">{summary}</p>}
      {meta && <p className="mt-auto pt-space-sm text-caption text-copy-muted">{meta}</p>}
    </div>
  </Link>
);

export default ArticleCard;
