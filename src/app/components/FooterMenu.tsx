'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Link = { label: React.ReactNode; href: string };
// Links of a column, optionally under a sub-heading (e.g. "Financial Services" inside "Industries")
export type FooterGroup = { title?: string; links: Link[] };

// `columns`: sub-groups side by side from md (e.g. "Financial Services" | "News Media"), with the same gap
// as between footer columns; otherwise stacked
const GroupList = ({
  groups,
  linkSpacing,
  columns = false,
}: {
  groups: FooterGroup[];
  linkSpacing: string;
  columns?: boolean;
}) => (
  <div className={clsx('flex flex-col gap-space-lg', columns && 'md:flex-row md:gap-x-space-3xl')}>
    {groups.map((group, groupIdx) => (
      <div key={groupIdx}>
        {group.title && <p className="eyebrow text-inverse/60 mb-space-xs">{group.title}</p>}
        <ul className={clsx(linkSpacing, '!list-none pl-0 m-0')}>
          {group.links.map((link, idx) => (
            <li key={idx} className="text-body-sm">
              <a href={link.href} className="hover:underline text-body-sm text-inverse/80">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default function FooterMenu({
  url,
  title,
  groups,
  wide = false,
}: {
  url?: string;
  title: string;
  groups: FooterGroup[];
  // Columns with sub-groups: the sub-groups sit side by side on desktop
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:shrink-0 border-b border-inverse/20 md:border-0">
      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <button
          className="w-full flex justify-between items-center py-space-sm focus:outline-none"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          {url ? (
            <a href={url} className="hover:underline text-body-sm font-text">
              {title}
            </a>
          ) : (
            <span className="text-body-sm font-text">{title}</span>
          )}
          <ChevronDown
            className={clsx('w-4 h-4 transition-transform duration-300', open ? 'rotate-180' : 'rotate-0')}
          />
        </button>
        <div
          className={clsx('overflow-hidden transition-all duration-300', open ? 'max-h-250 mb-space-md' : 'max-h-0')}
        >
          <GroupList groups={groups} linkSpacing="space-y-space-sm" />
        </div>
      </div>
      {/* Desktop: always open */}
      <div className="hidden md:block">
        {url ? (
          <a href={url} className="block mb-space-md hover:underline font-text">
            {title}
          </a>
        ) : (
          <p className="mb-space-md font-text">{title}</p>
        )}
        <GroupList groups={groups} linkSpacing="space-y-space-xs" columns={wide} />
      </div>
    </div>
  );
}
