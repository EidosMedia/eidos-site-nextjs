'use client';
import { useState } from 'react';
import { UPDATER_TOPICS, UpdaterTopicSlug } from '@/utilities/updaterTopics';
import { pillTabClasses } from '../baseComponents/pillTab';
import UpdaterCardGrid from './UpdaterCardGrid';
import type { UpdaterItem } from './types';

// "Latest by topic": topic filter tabs (All + topics) over a paginated card grid.
const UpdaterTopicGrid = ({ items }: { items: UpdaterItem[] }) => {
  const [topic, setTopic] = useState<UpdaterTopicSlug | undefined>();
  const filteredItems = topic ? items.filter(item => item.topic === topic) : items;

  return (
    <section className="py-space-3xl">
      <h2 className="text-h2 text-heading text-center">Latest by topic</h2>

      <div className="flex flex-wrap items-center justify-center gap-space-2xs mt-space-md mb-space-xl" role="tablist">
        <button role="tab" aria-selected={!topic} onClick={() => setTopic(undefined)} className={pillTabClasses(!topic)}>
          All
        </button>
        {UPDATER_TOPICS.map(({ slug, label }) => (
          <button
            key={slug}
            role="tab"
            aria-selected={topic === slug}
            onClick={() => setTopic(slug)}
            className={pillTabClasses(topic === slug)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* key: restart the pagination when the topic changes */}
      <UpdaterCardGrid key={topic ?? 'all'} items={filteredItems} />
    </section>
  );
};

export default UpdaterTopicGrid;
