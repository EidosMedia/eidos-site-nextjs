'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { BaseModel, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { Megaphone, Bell, CalendarDays, ChevronRight } from 'lucide-react';
import { NEWS_CATEGORIES, NEWSROOM_LABEL, getNewsCategoryLabel, getNodeNewsCategory } from '@/utilities/newsCategories';
import NewsList from './NewsList';
import InPageSearch from '../InPageSearch';
import { getNewsImageUrl } from '@/utilities/news';

type NewsroomContentProps = {
  data: PageData<BaseModel>;
};

const CATEGORY_ICONS = {
  'news-release': Megaphone,
  'product-news': Bell,
  'event-news': CalendarDays,
} as const;

const NewsroomContent: React.FC<NewsroomContentProps> = ({ data }) => {
  const sectionUrl = data.model.data.url || '/';
  const childrenIds = data.model.data.children || [];
  const items = useMemo(
    () =>
      childrenIds
        .map(id => data.model.nodes[id])
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(b.pubInfo?.publicationTime ?? 0).getTime() - new Date(a.pubInfo?.publicationTime ?? 0).getTime(),
        ),
    [childrenIds, data.model.nodes],
  );

  const featured = items[0];
  const featuredCategoryLabel = getNewsCategoryLabel(getNodeNewsCategory(featured)) ?? 'Latest';

  if (items.length === 0) {
    return <div className="container mx-auto flex align-center justify-center py-space-5xl">No articles found.</div>;
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center px-space-md pt-space-3xl pb-space-xl">
        <h1 className="text-h1 text-heading mb-space-sm">{NEWSROOM_LABEL}</h1>
        <p className="text-lead text-copy-muted mb-space-lg">Updates on projects, products and events</p>

        <div className="flex flex-wrap items-center justify-center gap-x-space-lg gap-y-space-sm">
          {NEWS_CATEGORIES.map(category => (
            <Link
              key={category.slug}
              href={`${sectionUrl}${category.slug}/`}
              className="font-semibold text-primary no-underline hover:underline"
            >
              {category.label}
            </Link>
          ))}

          {/* Same find-in-page field as the article breadcrumb */}
          <InPageSearch placeholder="Search in this page" bordered={false} />
        </div>
      </div>

      {/* Featured story + category cards */}
      <div className="full-bleed bg-surface py-space-3xl">
        <div className="max-w-page mx-auto px-space-md">
          {featured && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl items-center mb-space-4xl">
              <div>
                <p className="text-body-sm font-semibold text-primary mb-space-xs">{featuredCategoryLabel}</p>
                <h2 className="text-h2 text-heading mb-space-md">{featured.title}</h2>
                <Link
                  href={featured.url}
                  className="inline-flex items-center gap-space-3xs font-semibold text-primary no-underline hover:underline"
                >
                  Read more <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="rounded-media overflow-hidden bg-line aspect-video flex items-center justify-center">
                {getNewsImageUrl(featured, 'Wide_large') ? (
                  <img
                    src={getNewsImageUrl(featured, 'Wide_large')}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-copy-subtle text-body-sm">No main image available</span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
            {NEWS_CATEGORIES.map(category => {
              const Icon = CATEGORY_ICONS[category.slug];
              return (
                <div key={category.slug} className="flex flex-col gap-space-xs">
                  <Icon className="w-6 h-6 text-primary" />
                  <p className="font-semibold text-heading">{category.label}</p>
                  <p className="text-body-sm text-copy-muted">{category.blurb}</p>
                  <Link
                    href={`${sectionUrl}${category.slug}/`}
                    className="inline-flex items-center gap-space-3xs text-body-sm font-semibold text-primary no-underline hover:underline"
                  >
                    See all {category.label.toLowerCase()} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exclude the featured story, already shown above */}
      {items.length > 1 && <NewsList title="All news" items={items.slice(1)} />}
    </div>
  );
};

export default NewsroomContent;
