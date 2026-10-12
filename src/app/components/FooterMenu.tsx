'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Link = { label: React.ReactNode; href: string };
// Links of a column, optionally under a sub-heading (e.g. "Financial Services" inside "Industries")
export type FooterGroup = { title?: string; links: Link[] };

const GroupList = ({ groups, linkSpacing }: { groups: FooterGroup[]; linkSpacing: string }) => (
  <div className="flex flex-col gap-space-sm mt-space-2xs">
    {groups.map((group, groupIdx) => (
      <div key={groupIdx}>
        {group.title && <p className="eyebrow text-inverse/60 mb-space-2xs">{group.title}</p>}
        <ul className={clsx(linkSpacing, '!list-none pl-0 m-0')}>
          {group.links.map((link, idx) => (
            <li key={idx}>
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
  // Double width on desktop, for columns with sub-groups and long labels (fewer wrapped lines, shorter footer)
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx('flex flex-col border-b border-inverse/20 md:border-0', wide && 'lg:col-span-2')}>
      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <button
          className="w-full flex justify-between items-center py-space-sm focus:outline-none"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          {url ? (
            <a href={url} className="hover:underline text-body-sm font-medium">
              {title}
            </a>
          ) : (
            <span className="text-body-sm font-medium">{title}</span>
          )}
          <ChevronDown
            className={clsx('w-4 h-4 transition-transform duration-300', open ? 'rotate-180' : 'rotate-0')}
          />
        </button>
        <div className={clsx('overflow-hidden transition-all duration-300', open ? 'max-h-250 mb-space-sm' : 'max-h-0')}>
          <GroupList groups={groups} linkSpacing="space-y-space-sm" />
        </div>
      </div>
      {/* Desktop: always open */}
      <div className="hidden md:block">
        {url ? (
          <a href={url} className="hover:underline font-bold">
            {title}
          </a>
        ) : (
          <span className="font-bold">{title}</span>
        )}
        <GroupList groups={groups} linkSpacing="space-y-space-2xs" />
      </div>
    </div>
  );
}
