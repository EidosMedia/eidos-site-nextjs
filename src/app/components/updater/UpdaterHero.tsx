import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getUpdaterTopic } from '@/utilities/updaterTopics';
import type { UpdaterItem } from './types';

// "Name, Role" bylines: the name is highlighted, the role follows in plain text.
const Byline = ({ byline }: { byline: string }) => {
  const [name, ...role] = byline.split(',');
  return (
    <p className="text-body-sm text-copy">
      By <span className="font-semibold text-primary">{name.trim()}</span>
      {role.length > 0 && `, ${role.join(',').trim()}`}
    </p>
  );
};

// Featured (latest) Updater article: text on the left, cover image on the right, in a white card.
const UpdaterHero = ({ item }: { item: UpdaterItem }) => {
  const topic = getUpdaterTopic(item.topic);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-canvas rounded-card shadow-xl overflow-hidden">
      <div className="flex flex-col justify-center gap-space-sm p-space-2xl order-2 md:order-1">
        {topic && <p className="text-body-sm font-semibold text-primary">{topic.label}</p>}
        <h2 className="text-h2 text-heading">{item.title}</h2>
        {item.summary && <p className="text-body text-copy-muted">{item.summary}</p>}
        {item.byline && <Byline byline={item.byline} />}
        <Link
          href={item.url}
          className="mt-space-md inline-flex items-center gap-space-3xs font-semibold text-primary no-underline hover:underline"
        >
          Read more <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="p-space-sm order-1 md:order-2">
        <div className="aspect-video md:aspect-auto md:h-full rounded-media overflow-hidden bg-surface">
          {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
        </div>
      </div>
    </div>
  );
};

export default UpdaterHero;
