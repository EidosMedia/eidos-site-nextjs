'use client';
import React, { ReactNode, useState } from 'react';
import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import NewsListItem from './NewsListItem';
import ShowMoreButton from '../baseComponents/ShowMoreButton';

type NewsListProps = {
  title: string;
  items: BaseModel[];
  // Rendered below the title (e.g. category tabs)
  header?: ReactNode;
};

const PAGE_SIZE = 6;

const NewsList: React.FC<NewsListProps> = ({ title, items, header }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="py-space-3xl">
      <h1 className="text-h2 text-heading mb-space-xs">{title}</h1>
      {header}

      {items.length === 0 ? (
        <p className="text-copy-muted mt-space-xl">No articles found.</p>
      ) : (
        <>
          <div className="mt-space-lg divide-y divide-line">
            {visibleItems.map(item => (
              <NewsListItem key={item.id} item={item} />
            ))}
          </div>

          {visibleCount < items.length && <ShowMoreButton onClick={() => setVisibleCount(count => count + PAGE_SIZE)} />}
        </>
      )}
    </div>
  );
};

export default NewsList;
