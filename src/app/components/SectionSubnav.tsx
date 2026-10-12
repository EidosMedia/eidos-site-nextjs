import { Fragment } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import InPageSearch from './InPageSearch';

type SectionSubnavProps = {
  // Back link to the listing section (e.g. "Latest news", "The Updater")
  label: string;
  href: string;
  // Further breadcrumb steps after the section link (e.g. topic, article title); without href = current page
  crumbs?: { label: string; href?: string }[];
  // true when the subnav sits on a tinted band (bg-surface): the search field gets a white fill
  onSurface?: boolean;
};

// Sub navigation of the listing sections (Newsroom categories, Updater) and their articles:
// back link or breadcrumb + site search.
const SectionSubnav = ({ label, href, crumbs = [], onSurface = false }: SectionSubnavProps) => (
  <div className="py-space-sm flex items-center justify-between gap-space-sm text-caption">
    {crumbs.length === 0 ? (
      <Link href={href} className="font-semibold text-primary no-underline hover:underline">
        {label}
      </Link>
    ) : (
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-space-3xs text-copy-muted">
        <Link href={href} className="no-underline hover:underline">
          {label}
        </Link>
        {crumbs.map(crumb => (
          <Fragment key={crumb.label}>
            <span className="text-copy-subtle">/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="no-underline hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </Fragment>
        ))}
      </nav>
    )}
    {crumbs.length > 0 ? (
      // Pages with a breadcrumb (articles, topic pages): find in the page itself
      <InPageSearch placeholder="Search in this page" bordered={onSurface} />
    ) : (
      <form action="/search" method="get" className="relative shrink-0">
        <Search className="w-4 h-4 text-copy-muted absolute left-space-xs top-1/2 -translate-y-1/2" />
        <input
          type="search"
          name="query"
          placeholder={`Search in ${label}`}
          className={`pl-space-lg pr-space-sm py-space-2xs rounded-full text-caption text-copy placeholder:text-copy-muted outline-none focus:ring-2 focus:ring-primary-lightest ${
            onSurface ? 'bg-canvas border border-line' : 'bg-surface-muted border-none'
          }`}
        />
      </form>
    )}
  </div>
);

export default SectionSubnav;
