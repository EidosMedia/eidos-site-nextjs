'use client';
import { useState } from 'react';
import ShowMoreButton from '../baseComponents/ShowMoreButton';
import UpdaterCard from './UpdaterCard';
import type { UpdaterItem } from './types';

const PAGE_SIZE = 6;

type UpdaterCardGridProps = {
  items: UpdaterItem[];
  // Hide the topic badge on the cards (e.g. on a topic page, where every card has the same topic)
  showTopic?: boolean;
};

// Paginated 3-column grid of Updater cards with "Show more".
const UpdaterCardGrid = ({ items, showTopic = true }: UpdaterCardGridProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return <p className="text-copy-muted mt-space-xl">No articles found.</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {items.slice(0, visibleCount).map(item => (
          <UpdaterCard key={item.id} item={item} variant="topic" showTopic={showTopic} />
        ))}
      </div>
      {visibleCount < items.length && <ShowMoreButton onClick={() => setVisibleCount(count => count + PAGE_SIZE)} />}
    </>
  );
};

export default UpdaterCardGrid;
