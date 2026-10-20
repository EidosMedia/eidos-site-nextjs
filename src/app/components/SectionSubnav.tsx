import { Fragment } from 'react';
import Link from 'next/link';
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
// back link or breadcrumb + find in page.
const SectionSubnav = ({ label, href, crumbs = [], onSurface = false }: SectionSubnavProps) => (
  <div className="py-space-sm flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-space-xs sm:gap-space-sm text-caption">
    {crumbs.length === 0 ? (
      <Link href={href} className="text-body font-text text-primary no-underline hover:underline">
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
    <InPageSearch placeholder="Search in this page" bordered={onSurface} />
  </div>
);

export default SectionSubnav;
