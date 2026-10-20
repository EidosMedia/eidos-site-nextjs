import Link from 'next/link';
import Badge, { BadgeTone } from '../baseComponents/badge';

export type ArticleCardProps = {
  href: string;
  title: string;
  imageUrl?: string;
  summary?: string;
  // Category / topic label above the title, optionally linking to the category page
  badge?: { label: string; tone: BadgeTone; href?: string };
  // Bottom line, e.g. "July 07, 2026 - 5 min read"
  meta?: string;
};

// Article card used by every card grid (Updater listings, related articles): cover image, optional badge,
// title, optional summary and meta line. Image and title link to the article (the image link is a duplicate,
// hidden from keyboard and screen readers); the badge can link to the category page; the text stays selectable.
const ArticleCard = ({ href, title, imageUrl, summary, badge, meta }: ArticleCardProps) => (
  <div className="flex flex-col h-full bg-canvas border border-line rounded-card overflow-hidden transition-shadow hover:shadow-lg">
    {/* DS media shape: the card background shows through the rounded bottom-right corner */}
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className="peer block aspect-video bg-surface overflow-hidden rounded-media"
    >
      {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
    </Link>
    <div className="flex flex-col flex-1 p-space-md gap-space-xs peer-hover:[&_.card-title]:underline">
      {badge && (
        <div>
          {badge.href ? (
            <Link href={badge.href} className="no-underline hover:opacity-80">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </Link>
          ) : (
            <Badge tone={badge.tone}>{badge.label}</Badge>
          )}
        </div>
      )}
      <Link href={href} className="card-title text-body font-title text-heading no-underline hover:underline">
        {title}
      </Link>
      {summary && <p className="text-body-sm text-copy-muted line-clamp-4">{summary}</p>}
      {meta && <p className="mt-auto pt-space-sm text-caption text-copy-muted">{meta}</p>}
    </div>
  </div>
);

export default ArticleCard;
